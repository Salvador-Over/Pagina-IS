const Usuario = require('../Model/usuarios.model');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'tu_secreto_jwt_aqui'; // En producción, usar variables de entorno

exports.registrar = async (req, res) => {
    try {
        const { nombre, email, password, rol } = req.body;
        
        // Verificar si el usuario ya existe
        const usuarioExistente = await Usuario.findOne({ where: { email } });
        if (usuarioExistente) {
            return res.status(400).json({ message: 'El email ya está registrado' });
        }

        // Crear nuevo usuario
        const usuario = await Usuario.create({
            nombre,
            email,
            password,
            rol
        });

        res.status(201).json({
            message: 'Usuario registrado exitosamente',
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                email: usuario.email,
                rol: usuario.rol
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al registrar usuario', error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Intento de login para email:', email);

        // Buscar usuario
        const usuario = await Usuario.findOne({ where: { email } });
        if (!usuario) {
            console.log('Usuario no encontrado');
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        console.log('Usuario encontrado:', usuario.nombre);
        console.log('Contraseña almacenada:', usuario.password);

        // Verificar contraseña
        const passwordValido = await usuario.comparePassword(password);
        console.log('Resultado de la comparación de contraseñas:', passwordValido);
        
        if (!passwordValido) {
            console.log('Contraseña incorrecta');
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        // Generar token
        const token = jwt.sign(
            { id: usuario.id, email: usuario.email, rol: usuario.rol },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        console.log('Login exitoso, token generado');
        res.json({
            message: 'Login exitoso',
            token,
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                email: usuario.email,
                rol: usuario.rol
            }
        });
    } catch (error) {
        console.error('Error en el login:', error);
        res.status(500).json({ message: 'Error en el login', error: error.message });
    }
};

exports.obtenerUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.findAll({
            attributes: ['id', 'nombre', 'email', 'rol']
        });
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener usuarios', error: error.message });
    }
};

exports.obtenerUsuario = async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.params.id, {
            attributes: ['id', 'nombre', 'email', 'rol']
        });
        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json(usuario);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener usuario', error: error.message });
    }
};

exports.actualizarUsuario = async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.params.id);
        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        await usuario.update(req.body);
        res.json({
            message: 'Usuario actualizado exitosamente',
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                email: usuario.email,
                rol: usuario.rol
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar usuario', error: error.message });
    }
};

exports.eliminarUsuario = async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.params.id);
        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        await usuario.destroy();
        res.json({ message: 'Usuario eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar usuario', error: error.message });
    }
};