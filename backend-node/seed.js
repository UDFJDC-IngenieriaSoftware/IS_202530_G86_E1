const bcrypt = require('bcryptjs');
const pool = require('./config/database');

async function seed() {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    console.log('🌱 Iniciando seed de la base de datos...\n');

    // 1. Project_area (sin dependencias)
    console.log('📦 Insertando Project_area...');
    await client.query(`
      INSERT INTO Project_area (proyect_area_id, name, project_email) VALUES
      (1, 'Ingeniería de Sistemas', 'sistemas@udistrital.edu.co'),
      (2, 'Ingeniería Industrial', 'industrial@udistrital.edu.co'),
      (3, 'Matemáticas Aplicadas', 'matematicas@udistrital.edu.co')
      ON CONFLICT (proyect_area_id) DO NOTHING
    `);
    console.log('✅ Project_area insertado\n');

    // 2. app_user (necesario para Teacher y Student)
    console.log('👥 Insertando app_user...');
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    // Usuarios administradores
    await client.query(`
      INSERT INTO app_user (name, email, password, role) VALUES
      ('Admin Principal', 'admin1@udistrital.edu.co', $1, 'ADMINISTRADOR'),
      ('Admin Secundario', 'admin2@udistrital.edu.co', $1, 'ADMINISTRADOR'),
      ('Admin Terciario', 'admin3@udistrital.edu.co', $1, 'ADMINISTRADOR')
      ON CONFLICT (email) DO NOTHING
    `, [hashedPassword]);

    // Usuarios coordinadores
    await client.query(`
      INSERT INTO app_user (name, email, password, role) VALUES
      ('Profesor Coordinador 1', 'coord1@udistrital.edu.co', $1, 'COORDINADOR'),
      ('Profesor Coordinador 2', 'coord2@udistrital.edu.co', $1, 'COORDINADOR'),
      ('Profesor Coordinador 3', 'coord3@udistrital.edu.co', $1, 'COORDINADOR')
      ON CONFLICT (email) DO NOTHING
    `, [hashedPassword]);

    // Usuarios estudiantes
    await client.query(`
      INSERT INTO app_user (name, email, password, role) VALUES
      ('Estudiante 1', 'estudiante1@udistrital.edu.co', $1, 'ESTUDIANTE'),
      ('Estudiante 2', 'estudiante2@udistrital.edu.co', $1, 'ESTUDIANTE'),
      ('Estudiante 3', 'estudiante3@udistrital.edu.co', $1, 'ESTUDIANTE'),
      ('Estudiante 4', 'estudiante4@udistrital.edu.co', $1, 'ESTUDIANTE'),
      ('Estudiante 5', 'estudiante5@udistrital.edu.co', $1, 'ESTUDIANTE'),
      ('Estudiante 6', 'estudiante6@udistrital.edu.co', $1, 'ESTUDIANTE'),
      ('Estudiante 7', 'estudiante7@udistrital.edu.co', $1, 'ESTUDIANTE'),
      ('Estudiante 8', 'estudiante8@udistrital.edu.co', $1, 'ESTUDIANTE'),
      ('Estudiante 9', 'estudiante9@udistrital.edu.co', $1, 'ESTUDIANTE')
      ON CONFLICT (email) DO NOTHING
    `, [hashedPassword]);
    console.log('✅ app_user insertado\n');

    // 3. Teacher (depende de app_user y Project_area)
    console.log('👨‍🏫 Insertando Teacher...');
    const coordUsers = await client.query(`
      SELECT user_id FROM app_user WHERE role = 'COORDINADOR' ORDER BY user_id LIMIT 3
    `);
    
    await client.query(`
      INSERT INTO Teacher (user_id, teacher_id, project_id, teacher_email) VALUES
      ($1, 1, 1, 'coord1@udistrital.edu.co'),
      ($2, 2, 2, 'coord2@udistrital.edu.co'),
      ($3, 3, 3, 'coord3@udistrital.edu.co')
      ON CONFLICT (teacher_id) DO NOTHING
    `, [
      coordUsers.rows[0].user_id,
      coordUsers.rows[1].user_id,
      coordUsers.rows[2].user_id
    ]);
    console.log('✅ Teacher insertado\n');

    // 4. Student (depende de app_user y Project_area)
    console.log('👨‍🎓 Insertando Student...');
    const studentUsers = await client.query(`
      SELECT user_id FROM app_user WHERE role = 'ESTUDIANTE' ORDER BY user_id LIMIT 9
    `);
    
    await client.query(`
      INSERT INTO Student (user_id, student_id, project_id, student_email) VALUES
      ($1, 1, 1, 'estudiante1@udistrital.edu.co'),
      ($2, 2, 1, 'estudiante2@udistrital.edu.co'),
      ($3, 3, 1, 'estudiante3@udistrital.edu.co'),
      ($4, 4, 2, 'estudiante4@udistrital.edu.co'),
      ($5, 5, 2, 'estudiante5@udistrital.edu.co'),
      ($6, 6, 2, 'estudiante6@udistrital.edu.co'),
      ($7, 7, 3, 'estudiante7@udistrital.edu.co'),
      ($8, 8, 3, 'estudiante8@udistrital.edu.co'),
      ($9, 9, 3, 'estudiante9@udistrital.edu.co')
      ON CONFLICT (student_id) DO NOTHING
    `, [
      studentUsers.rows[0].user_id,
      studentUsers.rows[1].user_id,
      studentUsers.rows[2].user_id,
      studentUsers.rows[3].user_id,
      studentUsers.rows[4].user_id,
      studentUsers.rows[5].user_id,
      studentUsers.rows[6].user_id,
      studentUsers.rows[7].user_id,
      studentUsers.rows[8].user_id
    ]);
    console.log('✅ Student insertado\n');

    // 5. Cordinator (depende de Teacher)
    console.log('🎯 Insertando Cordinator...');
    await client.query(`
      INSERT INTO Cordinator (coordinator_id, teacher_id) VALUES
      (1, 1),
      (2, 2),
      (3, 3)
      ON CONFLICT (coordinator_id) DO NOTHING
    `);
    console.log('✅ Cordinator insertado\n');

    // 6. Investigation_area (depende de Project_area)
    console.log('🔬 Insertando Investigation_area...');
    await client.query(`
      INSERT INTO Investigation_area (project_area_id, name, description) VALUES
      (1, 'Inteligencia Artificial', 'Área de investigación enfocada en el desarrollo de sistemas inteligentes y aprendizaje automático'),
      (1, 'Desarrollo de Software', 'Área de investigación en metodologías y herramientas de desarrollo de software'),
      (1, 'Redes y Comunicaciones', 'Área de investigación en redes de computadores y protocolos de comunicación'),
      (2, 'Optimización Industrial', 'Área de investigación en métodos de optimización para procesos industriales'),
      (2, 'Gestión de Calidad', 'Área de investigación en sistemas de gestión y control de calidad'),
      (2, 'Logística y Cadena de Suministro', 'Área de investigación en gestión logística y cadenas de suministro'),
      (3, 'Matemáticas Computacionales', 'Área de investigación en métodos numéricos y computación científica'),
      (3, 'Análisis de Datos', 'Área de investigación en técnicas de análisis y procesamiento de datos'),
      (3, 'Modelado Matemático', 'Área de investigación en construcción de modelos matemáticos para problemas reales')
      ON CONFLICT DO NOTHING
    `);
    console.log('✅ Investigation_area insertado\n');

    // 7. Investigation_team (depende de Investigation_area y Cordinator)
    console.log('👥 Insertando Investigation_team...');
    const areas = await client.query(`
      SELECT investigation_area_id FROM Investigation_area ORDER BY investigation_area_id LIMIT 3
    `);
    
    await client.query(`
      INSERT INTO Investigation_team (area_id, cordinator_id, name, team_email, description) VALUES
      ($1, 1, 'Equipo de IA Avanzada', 'ia-team@udistrital.edu.co', 'Equipo dedicado a la investigación en inteligencia artificial y machine learning'),
      ($2, 2, 'Equipo de Optimización', 'optimizacion-team@udistrital.edu.co', 'Equipo enfocado en métodos de optimización industrial y gestión de procesos'),
      ($3, 3, 'Equipo de Análisis de Datos', 'datos-team@udistrital.edu.co', 'Equipo especializado en análisis de datos y modelado matemático')
      ON CONFLICT DO NOTHING
    `, [
      areas.rows[0].investigation_area_id,
      areas.rows[1].investigation_area_id,
      areas.rows[2].investigation_area_id
    ]);
    console.log('✅ Investigation_team insertado\n');

    // Actualizar Teacher y Student con team_id
    console.log('🔄 Actualizando Teacher y Student con team_id...');
    const teams = await client.query(`
      SELECT investigation_team_id FROM Investigation_team ORDER BY investigation_team_id LIMIT 3
    `);
    
    await client.query(`
      UPDATE Teacher SET team_id = $1 WHERE teacher_id = 1;
      UPDATE Teacher SET team_id = $2 WHERE teacher_id = 2;
      UPDATE Teacher SET team_id = $3 WHERE teacher_id = 3;
    `, [
      teams.rows[0].investigation_team_id,
      teams.rows[1].investigation_team_id,
      teams.rows[2].investigation_team_id
    ]);
    
    await client.query(`
      UPDATE Student SET team_id = $1 WHERE student_id IN (1, 2, 3);
      UPDATE Student SET team_id = $2 WHERE student_id IN (4, 5, 6);
      UPDATE Student SET team_id = $3 WHERE student_id IN (7, 8, 9);
    `, [
      teams.rows[0].investigation_team_id,
      teams.rows[1].investigation_team_id,
      teams.rows[2].investigation_team_id
    ]);
    console.log('✅ Teacher y Student actualizados\n');

    // 8. Investigation_project (depende de Investigation_team)
    console.log('📋 Insertando Investigation_project...');
    await client.query(`
      INSERT INTO Investigation_project (team_id, title, resume, state) VALUES
      ($1, 'Sistema de Reconocimiento Facial', 'Desarrollo de un sistema de reconocimiento facial usando deep learning para aplicaciones de seguridad', 1),
      ($1, 'Chatbot Inteligente para Atención al Cliente', 'Implementación de un chatbot usando procesamiento de lenguaje natural para mejorar la atención al cliente', 2),
      ($1, 'Análisis Predictivo con Machine Learning', 'Desarrollo de modelos predictivos para análisis de tendencias y comportamiento de usuarios', 0),
      ($2, 'Optimización de Rutas de Distribución', 'Desarrollo de algoritmos para optimizar rutas de distribución y reducir costos logísticos', 1),
      ($2, 'Sistema de Gestión de Inventarios', 'Implementación de un sistema inteligente para gestión y control de inventarios en tiempo real', 2),
      ($2, 'Análisis de Eficiencia Energética', 'Estudio y optimización del consumo energético en procesos industriales', 0),
      ($3, 'Modelo Predictivo de Series Temporales', 'Desarrollo de modelos matemáticos para predicción de series temporales en datos económicos', 1),
      ($3, 'Análisis de Big Data con Hadoop', 'Implementación de soluciones de big data usando tecnologías Hadoop y Spark', 2),
      ($3, 'Sistema de Recomendación Inteligente', 'Desarrollo de un sistema de recomendación usando técnicas de filtrado colaborativo', 0)
      ON CONFLICT DO NOTHING
    `, [
      teams.rows[0].investigation_team_id,
      teams.rows[1].investigation_team_id,
      teams.rows[2].investigation_team_id
    ]);
    console.log('✅ Investigation_project insertado\n');

    // 9. Product_type (sin dependencias)
    console.log('📚 Insertando Product_type...');
    await client.query(`
      INSERT INTO Product_type (name, description) VALUES
      ('Artículo Científico', 'Publicación en revista científica indexada o conferencia internacional'),
      ('Libro', 'Publicación de libro o capítulo de libro en editorial reconocida'),
      ('Software', 'Desarrollo de software o aplicación con valor académico o comercial'),
      ('Patente', 'Registro de patente de invención o modelo de utilidad'),
      ('Prototipo', 'Desarrollo de prototipo funcional para demostración de conceptos'),
      ('Informe Técnico', 'Documento técnico que describe resultados de investigación')
      ON CONFLICT DO NOTHING
    `);
    console.log('✅ Product_type insertado\n');

    // 10. Product (depende de Investigation_project y Product_type)
    console.log('📄 Insertando Product...');
    const projects = await client.query(`
      SELECT investigation_project_id FROM Investigation_project ORDER BY investigation_project_id LIMIT 9
    `);
    const productTypes = await client.query(`
      SELECT product_type_id FROM Product_type ORDER BY product_type_id LIMIT 6
    `);
    
    // Mapear tipos de producto
    const articulo = productTypes.rows[0].product_type_id; // Artículo
    const libro = productTypes.rows[1].product_type_id; // Libro
    const software = productTypes.rows[2].product_type_id; // Software
    const patente = productTypes.rows[3].product_type_id; // Patente
    const prototipo = productTypes.rows[4].product_type_id; // Prototipo
    const informe = productTypes.rows[5].product_type_id; // Informe
    
    await client.query(`
      INSERT INTO Product (investigation_project_id, type_product_id, title, document, public_date) VALUES
      ($1, $10, 'Artículo: Reconocimiento Facial con CNN', 'articulo_cnn_2024.pdf', '2024-01-15'),
      ($1, $12, 'Software: Sistema de Reconocimiento', 'software_reconocimiento_v1.0.zip', '2024-02-20'),
      ($2, $10, 'Artículo: Chatbot con NLP', 'articulo_chatbot_nlp.pdf', '2024-03-10'),
      ($3, $13, 'Patente: Algoritmo Predictivo', 'patente_algoritmo_2024.pdf', '2024-04-05'),
      ($4, $10, 'Artículo: Optimización de Rutas', 'articulo_rutas_2024.pdf', '2024-01-25'),
      ($4, $14, 'Prototipo: Sistema de Rutas', 'prototipo_rutas_v1.0.zip', '2024-02-15'),
      ($5, $12, 'Software: Gestión de Inventarios', 'software_inventarios_v2.0.zip', '2024-03-20'),
      ($6, $15, 'Informe: Eficiencia Energética', 'informe_energia_2024.pdf', '2024-04-10'),
      ($7, $10, 'Artículo: Series Temporales', 'articulo_series_2024.pdf', '2024-01-30'),
      ($7, $12, 'Software: Análisis de Series', 'software_series_v1.5.zip', '2024-02-25'),
      ($8, $10, 'Artículo: Big Data con Hadoop', 'articulo_bigdata_2024.pdf', '2024-03-15'),
      ($9, $12, 'Software: Sistema de Recomendación', 'software_recomendacion_v1.0.zip', '2024-04-20')
      ON CONFLICT DO NOTHING
    `, [
      projects.rows[0].investigation_project_id,
      projects.rows[1].investigation_project_id,
      projects.rows[2].investigation_project_id,
      projects.rows[3].investigation_project_id,
      projects.rows[4].investigation_project_id,
      projects.rows[5].investigation_project_id,
      projects.rows[6].investigation_project_id,
      projects.rows[7].investigation_project_id,
      projects.rows[8].investigation_project_id,
      articulo,    // $10
      libro,       // $11 (no usado)
      software,    // $12
      patente,     // $13
      prototipo,   // $14
      informe      // $15
    ]);
    console.log('✅ Product insertado\n');

    // 11. Product_student (depende de Product y Student)
    console.log('👨‍🎓📄 Insertando Product_student...');
    const products = await client.query(`
      SELECT product_id FROM Product ORDER BY product_id LIMIT 12
    `);
    
    const productIds = products.rows.map(row => row.product_id);
    
    await client.query(`
      INSERT INTO Product_student (product_id, student_id) VALUES
      ($1, 1), ($1, 2),
      ($2, 1), ($2, 3),
      ($3, 2), ($3, 3),
      ($4, 1), ($4, 2), ($4, 3),
      ($5, 4), ($5, 5),
      ($6, 4), ($6, 6),
      ($7, 5), ($7, 6),
      ($8, 4), ($8, 5), ($8, 6),
      ($9, 7), ($9, 8),
      ($10, 7), ($10, 9),
      ($11, 8), ($11, 9),
      ($12, 7), ($12, 8), ($12, 9)
      ON CONFLICT DO NOTHING
    `, productIds);
    console.log('✅ Product_student insertado\n');

    // 12. Product_teacher (depende de Product y Teacher)
    console.log('👨‍🏫📄 Insertando Product_teacher...');
    await client.query(`
      INSERT INTO Product_teacher (product_id, teacher_id) VALUES
      ($1, 1), ($2, 1), ($3, 1), ($4, 1),
      ($5, 2), ($6, 2), ($7, 2), ($8, 2),
      ($9, 3), ($10, 3), ($11, 3), ($12, 3)
      ON CONFLICT DO NOTHING
    `, productIds);
    console.log('✅ Product_teacher insertado\n');

    // 13. Application (depende de app_user y Investigation_team)
    console.log('📝 Insertando Application...');
    const studentUsersForApp = await client.query(`
      SELECT user_id FROM app_user WHERE role = 'ESTUDIANTE' ORDER BY user_id LIMIT 6
    `);
    
    await client.query(`
      INSERT INTO Application (user_id, investigation_team_id, state, application_date, application_message, answer_date, answer_message) VALUES
      ($1, $7, 'APROBADA', '2024-01-10', 'Me interesa mucho el área de inteligencia artificial y machine learning. Tengo experiencia en Python y deep learning.', '2024-01-12', 'Bienvenido al equipo. Tu perfil encaja perfectamente.'),
      ($2, $7, 'PENDIENTE', '2024-02-15', 'Estoy interesado en participar en proyectos de reconocimiento de imágenes. Tengo conocimientos en visión computacional.', NULL, NULL),
      ($3, $7, 'RECHAZADA', '2024-03-01', 'Me gustaría unirme al equipo para trabajar en proyectos de NLP.', '2024-03-03', 'Gracias por tu interés. Actualmente no tenemos vacantes.'),
      ($4, $8, 'APROBADA', '2024-01-20', 'Tengo experiencia en optimización y algoritmos. Me gustaría contribuir al equipo.', '2024-01-22', 'Excelente. Te esperamos en la próxima reunión.'),
      ($5, $8, 'PENDIENTE', '2024-02-25', 'Estoy interesado en investigación en logística y cadena de suministro.', NULL, NULL),
      ($6, $9, 'APROBADA', '2024-01-05', 'Tengo conocimientos en análisis de datos y estadística. Me encantaría formar parte del equipo.', '2024-01-07', 'Perfecto. Tu perfil es ideal para nuestros proyectos.')
      ON CONFLICT DO NOTHING
    `, [
      studentUsersForApp.rows[0].user_id,
      studentUsersForApp.rows[1].user_id,
      studentUsersForApp.rows[2].user_id,
      studentUsersForApp.rows[3].user_id,
      studentUsersForApp.rows[4].user_id,
      studentUsersForApp.rows[5].user_id,
      teams.rows[0].investigation_team_id,
      teams.rows[1].investigation_team_id,
      teams.rows[2].investigation_team_id
    ]);
    console.log('✅ Application insertado\n');

    await client.query('COMMIT');
    console.log('✅ ¡Seed completado exitosamente! 🎉\n');
    console.log('📊 Resumen de datos insertados:');
    console.log('   - 3 Project_area');
    console.log('   - 15 app_user (3 admin, 3 coordinadores, 9 estudiantes)');
    console.log('   - 3 Teacher');
    console.log('   - 9 Student');
    console.log('   - 3 Cordinator');
    console.log('   - 9 Investigation_area');
    console.log('   - 3 Investigation_team');
    console.log('   - 9 Investigation_project');
    console.log('   - 6 Product_type');
    console.log('   - 12 Product');
    console.log('   - 24 Product_student (relaciones)');
    console.log('   - 12 Product_teacher (relaciones)');
    console.log('   - 6 Application\n');
    console.log('🔑 Credenciales de prueba:');
    console.log('   Email: admin1@udistrital.edu.co');
    console.log('   Password: password123');
    console.log('   (Todas las contraseñas son: password123)\n');

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error en el seed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Ejecutar seed
seed()
  .then(() => {
    console.log('✅ Proceso finalizado');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error fatal:', error);
    process.exit(1);
  });

