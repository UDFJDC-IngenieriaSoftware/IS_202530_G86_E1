const authService = require('../services/authService');
const { body, validationResult } = require('express-validator');

const validateRegister = [
  body('name').notEmpty().withMessage('El nombre es obligatorio'),
  body('email')
    .isEmail().withMessage('El email debe tener un formato válido')
    .matches(/@udistrital\.edu\.co$/).withMessage('El email debe ser del dominio @udistrital.edu.co'),
  body('password').notEmpty().withMessage('La contraseña es obligatoria'),
  body('role').isIn(['ESTUDIANTE']).withMessage('Solo se pueden registrar estudiantes. Los docentes y coordinadores deben ser creados por un administrador.'),
];

const validateLogin = [
  body('email').isEmail().withMessage('El email debe tener un formato válido'),
  body('password').notEmpty().withMessage('La contraseña es obligatoria'),
];

const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: errors.array()[0].msg,
        token: null,
        email: null,
        name: null,
        role: null
      });
    }

    const response = await authService.register(req.body);
    res.status(201).json(response);
  } catch (error) {
    console.error('Register error:', error);
    res.status(400).json({
      message: error.message || 'Error al registrar usuario',
      token: null,
      email: null,
      name: null,
      role: null
    });
  }
};

const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: errors.array()[0].msg,
        token: null,
        email: null,
        name: null,
        role: null
      });
    }

    const { email, password } = req.body;
    const response = await authService.login(email, password);
    res.json(response);
  } catch (error) {
    console.error('Login error:', error);
    res.status(401).json({
      message: 'Credenciales inválidas',
      token: null,
      email: null,
      name: null,
      role: null
    });
  }
};

module.exports = {
  register: [validateRegister, register],
  login: [validateLogin, login],
};

