-- CreateTable
CREATE TABLE "ods_equevtlog" (
    "time" TIMESTAMP(6),
    "toolid" VARCHAR(32),
    "moduleid" VARCHAR(32),
    "type" CHAR(1),
    "event" VARCHAR(32),
    "action" VARCHAR(32),
    "caller" VARCHAR(32),
    "recipeid" VARCHAR(80),
    "recipestepno" INTEGER,
    "acttime" INTEGER,
    "lotid" VARCHAR(80),
    "carrierid" VARCHAR(80),
    "slotno" INTEGER,
    "waferid" VARCHAR(80),
    "message" VARCHAR(80),
    "uuid" UUID NOT NULL,

    CONSTRAINT "ods_equevtlog_pk" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "ods_tracelog" (
    "time" TIMESTAMP(6),
    "toolid" VARCHAR(32),
    "moduleid" VARCHAR(32),
    "uuid" UUID NOT NULL,
    "altitude" REAL,
    "sound" REAL,
    "light" REAL,
    "vibration" REAL,
    "speed" REAL,

    CONSTRAINT "ods_tracelog_new_pk" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "wafer_process_info" (
    "toolid" VARCHAR(32) NOT NULL,
    "moduleid" VARCHAR(32) NOT NULL,
    "recipeid" VARCHAR(80) NOT NULL,
    "lotid" VARCHAR(80) NOT NULL,
    "carrierid" VARCHAR(80) NOT NULL,
    "slotno" INTEGER NOT NULL,
    "waferid" VARCHAR(80) NOT NULL,
    "sdate" TIMESTAMP(6),
    "edate" TIMESTAMP(6),

    CONSTRAINT "pk_wafer_process_info" PRIMARY KEY ("toolid","moduleid","recipeid","lotid","carrierid","slotno","waferid")
);

-- CreateTable
CREATE TABLE "wafer_process_step_info" (
    "toolid" VARCHAR(32) NOT NULL,
    "moduleid" VARCHAR(32) NOT NULL,
    "recipeid" VARCHAR(80) NOT NULL,
    "lotid" VARCHAR(80) NOT NULL,
    "carrierid" VARCHAR(80) NOT NULL,
    "slotno" INTEGER NOT NULL,
    "waferid" VARCHAR(80) NOT NULL,
    "recipestepno" INTEGER NOT NULL,
    "sdate" TIMESTAMP(6),
    "edate" TIMESTAMP(6),

    CONSTRAINT "pk_wafer_info" PRIMARY KEY ("toolid","moduleid","recipeid","lotid","carrierid","slotno","waferid","recipestepno")
);

-- CreateTable
CREATE TABLE "wafer_summary" (
    "time" TIMESTAMP(6) NOT NULL,
    "toolid" VARCHAR(32) NOT NULL,
    "moduleid" VARCHAR(32) NOT NULL,
    "recipeid" VARCHAR(80) NOT NULL,
    "lotid" VARCHAR(80) NOT NULL,
    "carrierid" VARCHAR(80) NOT NULL,
    "slotno" DECIMAL NOT NULL,
    "waferid" VARCHAR(80) NOT NULL,
    "recipestepno" DECIMAL NOT NULL,
    "altitude_max" DECIMAL,
    "altitude_min" DECIMAL,
    "altitude_avg" DECIMAL,
    "altitude_range" DECIMAL,
    "sound_max" DECIMAL,
    "sound_min" DECIMAL,
    "sound_avg" DECIMAL,
    "sound_range" DECIMAL,
    "light_max" DECIMAL,
    "light_min" DECIMAL,
    "light_avg" DECIMAL,
    "light_range" DECIMAL,
    "vibration_max" DECIMAL,
    "vibration_min" DECIMAL,
    "vibration_avg" DECIMAL,
    "vibration_range" DECIMAL,
    "speed_max" DECIMAL,
    "speed_min" DECIMAL,
    "speed_avg" DECIMAL,
    "speed_range" DECIMAL,

    CONSTRAINT "wafer_summary_new_pk" PRIMARY KEY ("toolid","moduleid","recipeid","lotid","carrierid","slotno","waferid","recipestepno")
);
