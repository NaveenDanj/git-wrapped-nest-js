import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {

    constructor() {
        super();
    }

    validate(payload: { sub: number, username: string }): any {
        const user = { id: payload.sub, username: payload.username }; // Replace with actual user retrieval logic
        return user;
    }

}