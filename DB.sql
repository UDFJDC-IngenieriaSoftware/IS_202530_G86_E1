-- Esquema de Base de Datos para Sistema de Investigación
-- Convertido desde diagrama de base de datos

-- Tabla app_user (renombrada para evitar palabra reservada "User")
CREATE TABLE app_user (
    user_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(32) NOT NULL
);

-- Tabla Project_area
CREATE TABLE Project_area (
    proyect_area_id INTEGER PRIMARY KEY NOT NULL UNIQUE,
    name VARCHAR NOT NULL,
    project_email VARCHAR NOT NULL
);

-- Tabla Teacher
CREATE TABLE Teacher (
    user_id INTEGER NOT NULL,
    teacher_id INTEGER NOT NULL UNIQUE,
    team_id INTEGER,
    project_id INTEGER NOT NULL,
    teacher_email VARCHAR(255) NOT NULL,
    PRIMARY KEY (user_id, teacher_id),
    FOREIGN KEY (user_id) REFERENCES app_user(user_id) ON DELETE NO ACTION ON UPDATE NO ACTION,
    FOREIGN KEY (project_id) REFERENCES Project_area(proyect_area_id) ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- Tabla Student
CREATE TABLE Student (
    user_id INTEGER NOT NULL UNIQUE,
    student_id INTEGER NOT NULL,
    team_id INTEGER,
    project_id INTEGER NOT NULL,
    student_email VARCHAR NOT NULL,
    PRIMARY KEY (user_id, student_id),
    UNIQUE (student_id),
    FOREIGN KEY (user_id) REFERENCES app_user(user_id) ON DELETE NO ACTION ON UPDATE NO ACTION,
    FOREIGN KEY (project_id) REFERENCES Project_area(proyect_area_id) ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- Tabla Cordinator
CREATE TABLE Cordinator (
    coordinator_id INTEGER NOT NULL UNIQUE,
    teacher_id INTEGER NOT NULL,
    PRIMARY KEY (coordinator_id, teacher_id),
    FOREIGN KEY (teacher_id) REFERENCES Teacher(teacher_id) ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- Tabla Investigation_area
CREATE TABLE Investigation_area (
    investigation_area_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    project_area_id INTEGER NOT NULL,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(1000) NOT NULL,
    FOREIGN KEY (project_area_id) REFERENCES Project_area(proyect_area_id) ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- Tabla Investigation_team
CREATE TABLE Investigation_team (
    investigation_team_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    area_id INTEGER NOT NULL,
    cordinator_id INTEGER NOT NULL,
    name VARCHAR(255) NOT NULL,
    team_email VARCHAR(255) NOT NULL,
    description VARCHAR(1000) NOT NULL,
    FOREIGN KEY (area_id) REFERENCES Investigation_area(investigation_area_id) ON DELETE NO ACTION ON UPDATE NO ACTION,
    FOREIGN KEY (cordinator_id) REFERENCES Cordinator(coordinator_id) ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- Agregar claves foráneas de Teacher y Student a Investigation_team (después de crear Investigation_team)
ALTER TABLE Teacher 
ADD FOREIGN KEY (team_id) REFERENCES Investigation_team(investigation_team_id) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE Student 
ADD FOREIGN KEY (team_id) REFERENCES Investigation_team(investigation_team_id) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- Tabla Investigation_project
CREATE TABLE Investigation_project (
    investigation_project_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    team_id INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    resume VARCHAR(2000) NOT NULL,
    state INTEGER NOT NULL,
    FOREIGN KEY (team_id) REFERENCES Investigation_team(investigation_team_id) ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- Tabla Product_type
CREATE TABLE Product_type (
    product_type_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(1000) NOT NULL
);

-- Tabla Product
CREATE TABLE Product (
    product_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    investigation_project_id INTEGER NOT NULL,
    type_product_id INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    document VARCHAR(255) NOT NULL,
    public_date DATE NOT NULL,
    FOREIGN KEY (investigation_project_id) REFERENCES Investigation_project(investigation_project_id) ON DELETE NO ACTION ON UPDATE NO ACTION,
    FOREIGN KEY (type_product_id) REFERENCES Product_type(product_type_id) ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- Tabla Product_student
CREATE TABLE Product_student (
    product_id INTEGER NOT NULL,
    student_id INTEGER NOT NULL,
    PRIMARY KEY (product_id, student_id),
    FOREIGN KEY (product_id) REFERENCES Product(product_id) ON DELETE NO ACTION ON UPDATE NO ACTION,
    FOREIGN KEY (student_id) REFERENCES Student(student_id) ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- Tabla Application
CREATE TABLE Application (
    application_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id INTEGER NOT NULL,
    investigation_team_id INTEGER NOT NULL,
    state VARCHAR(32) NOT NULL,
    application_date DATE NOT NULL,
    application_message VARCHAR(2000) NOT NULL,
    answer_date DATE,
    answer_message VARCHAR(2000),
    FOREIGN KEY (user_id) REFERENCES app_user(user_id) ON DELETE NO ACTION ON UPDATE NO ACTION,
    FOREIGN KEY (investigation_team_id) REFERENCES Investigation_team(investigation_team_id) ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- Tabla Product_teacher
CREATE TABLE Product_teacher (
    product_id INTEGER NOT NULL,
    teacher_id INTEGER NOT NULL,
    PRIMARY KEY (product_id, teacher_id),
    FOREIGN KEY (product_id) REFERENCES Product(product_id) ON DELETE NO ACTION ON UPDATE NO ACTION,
    FOREIGN KEY (teacher_id) REFERENCES Teacher(teacher_id) ON DELETE NO ACTION ON UPDATE NO ACTION
);
