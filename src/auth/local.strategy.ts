import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { access } from "fs";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy, 'jwt') {

    constructor() {
        super(
            {
                jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
                secretOrKey: process.env.JWT_SECRET || '',
            }
        );
    }

    validate(payload: { sub: number, username: string, accessToken: string }): any {
        console.log("JWT payload:", payload);
        const payloadData = { id: payload.sub, username: payload.username, accessToken: payload.accessToken };
        return payloadData;
    }

}