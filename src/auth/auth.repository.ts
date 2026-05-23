import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { Repository } from "typeorm";


@Injectable()
export class AuthRepository {

    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    async findOne(id: number) {
        return this.userRepository.findOne({ where: { id } });
    }

    async findByEmail(email: string) {
        return this.userRepository.findOne({ where: { email } });
    }

    async findByUsername(username: string) {
        return this.userRepository.findOne({ where: { username } })
    }

    async createUser(user: Partial<User>) {
        const newUser = this.userRepository.create(user);
        return this.userRepository.save(newUser);
    }
}