import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAvatarUrlToUsers1747048000000 implements MigrationInterface {
    name = 'AddAvatarUrlToUsers1747048000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "avatar_url" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "avatar_url"`);
    }
}
