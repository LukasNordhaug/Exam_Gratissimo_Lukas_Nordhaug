import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma";
import { AppError } from "../utils/AppError";

declare global {
  namespace Express {
    interface Request {
      user?: { id: number };
    }
  }
}

interface JwtPayload {
  exp: number;
  data: {
    id: number;
  };
}

export class AuthController {
  generateToken = (user: { id: number }, type: "access" | "refresh") => {
    const key = process.env[`TOKEN_${type.toUpperCase()}_KEY`];
    const expiresIn =
      process.env[`TOKEN_${type.toUpperCase()}_EXPIRATION_SECS`];

    if (!key || !expiresIn) {
      throw new Error(`Missing env vars for ${type} token`);
    }

    const exp = Math.floor(Date.now() / 1000) + Number(expiresIn);

    return jwt.sign(
      {
        exp,
        iat: Math.floor(Date.now() / 1000),
        data: {
          id: user.id,
        },
      },
      key,
    );
  };

  authenticate = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    if (!username || !password) {
      throw new AppError(400, "Missing credentials");
    }

    const user = await prisma.user.findFirst({
      where: { email: username },
      select: {
        id: true,
        firstname: true,
        lastname: true,
        password: true,
      },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new AppError(401, "Invalid credentials");
    }

    const refreshToken = this.generateToken(user, "refresh");
    const accessToken = this.generateToken(user, "access");

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    return res.json({
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
      },
    });
  };

  refreshAccessToken = async (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new AppError(401, "Refresh token required");
    }

    const user = await prisma.user.findFirst({ where: { refreshToken } });

    if (!user) {
      throw new AppError(401, "Invalid refresh token");
    }

    jwt.verify(refreshToken, process.env.TOKEN_REFRESH_KEY!);

    // Rotate token - issue a new refresh token on every use
    const newRefreshToken = this.generateToken(user, "refresh");
    const accessToken = this.generateToken(user, "access");

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: newRefreshToken },
    });

    return res.json({ accessToken, refreshToken: newRefreshToken });
  };

  logout = async (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    if (refreshToken) {
      await prisma.user.updateMany({
        where: { refreshToken },
        data: { refreshToken: null },
      });
    }

    return res.sendStatus(204);
  };

  // authorize already verified the token and set req.user
  getUserFromToken = (req: Request, res: Response) => {
    return res.json({ userId: req.user!.id });
  };

  authorize = async (req: Request, res: Response, next: NextFunction) => {
    const bearerHeader = req.headers["authorization"];

    if (!bearerHeader?.startsWith("Bearer ")) {
      throw new AppError(401, "Token not accepted");
    }

    const token = bearerHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.TOKEN_ACCESS_KEY!,
    ) as JwtPayload;

    req.user = decoded.data;

    return next();
  };
}

export const authController = new AuthController();
