const { sequelize } = require('../models/index');

const installUserNormalizationTrigger = async () => {
    await sequelize.query(`
        CREATE OR REPLACE FUNCTION normalize_usuario_text_fields()
        RETURNS trigger AS $$
        BEGIN
            NEW."nombre" = UPPER(TRIM(NEW."nombre"));
            NEW."apellido" = UPPER(TRIM(NEW."apellido"));
            NEW."cedula" = UPPER(TRIM(NEW."cedula"));
            NEW."correo" = LOWER(TRIM(NEW."correo"));

            IF NEW."telefono" IS NOT NULL THEN
                NEW."telefono" = TRIM(NEW."telefono");
                IF NEW."telefono" !~ '^[0-9]+$' THEN
                    RAISE EXCEPTION 'El telefono solo debe contener numeros.';
                END IF;
                NEW."telefono" = UPPER(NEW."telefono");
            END IF;

            IF NEW."direccion" IS NOT NULL THEN
                NEW."direccion" = UPPER(TRIM(NEW."direccion"));
            END IF;

            IF NEW."genero" IS NOT NULL THEN
                NEW."genero" = UPPER(TRIM(NEW."genero"));
            END IF;

            IF NEW."poseeLesion" IS NOT NULL THEN
                NEW."poseeLesion" = UPPER(TRIM(NEW."poseeLesion"));
            END IF;

            IF NEW."detalleLesion" IS NOT NULL THEN
                NEW."detalleLesion" = UPPER(TRIM(NEW."detalleLesion"));
            END IF;

            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;

        DROP TRIGGER IF EXISTS normalize_usuario_text_fields_trigger ON "Usuarios";

        CREATE TRIGGER normalize_usuario_text_fields_trigger
        BEFORE INSERT OR UPDATE ON "Usuarios"
        FOR EACH ROW
        EXECUTE FUNCTION normalize_usuario_text_fields();
    `);
};

module.exports = installUserNormalizationTrigger;
