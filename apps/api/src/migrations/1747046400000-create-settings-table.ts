import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSettingsTable1747046400000 implements MigrationInterface {
    name = 'CreateSettingsTable1747046400000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "settings" (
                "id_settings" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "company_name" character varying(255) NOT NULL DEFAULT 'My Company',
                "warehouse_address" text,
                "timezone" character varying(100) NOT NULL DEFAULT 'Asia/Jakarta',
                "logo_url" character varying,
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_settings" PRIMARY KEY ("id_settings")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "settings"`);
    }
}
