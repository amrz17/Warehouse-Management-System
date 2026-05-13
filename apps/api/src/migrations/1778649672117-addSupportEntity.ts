import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSupportEntity1778649672117 implements MigrationInterface {
    name = 'AddSupportEntity1778649672117'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."support_tickets_priority_enum" AS ENUM('LOW', 'MEDIUM', 'HIGH')`);
        await queryRunner.query(`CREATE TYPE "public"."support_tickets_status_enum" AS ENUM('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED')`);
        await queryRunner.query(`CREATE TABLE "support_tickets" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(255) NOT NULL, "description" text NOT NULL, "priority" "public"."support_tickets_priority_enum" NOT NULL DEFAULT 'MEDIUM', "status" "public"."support_tickets_status_enum" NOT NULL DEFAULT 'OPEN', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "userIdUser" uuid, CONSTRAINT "PK_942e8d8f5df86100471d2324643" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "support_tickets" ADD CONSTRAINT "FK_6774e59e11e0da80340ae121b20" FOREIGN KEY ("userIdUser") REFERENCES "users"("id_user") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "support_tickets" DROP CONSTRAINT "FK_6774e59e11e0da80340ae121b20"`);
        await queryRunner.query(`DROP TABLE "support_tickets"`);
        await queryRunner.query(`DROP TYPE "public"."support_tickets_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."support_tickets_priority_enum"`);
    }

}
