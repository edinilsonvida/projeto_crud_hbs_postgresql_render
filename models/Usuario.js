const connection = require('../db');

// Função atualizada para lidar com a resposta do pg
async function executarQuery(sql, parametros = []) {
  try {
    const resultado = await connection.query(sql, parametros);
    // Retornamos apenas a propriedade "rows" que contém os dados da tabela
    return resultado.rows ? resultado.rows : [];
  } catch (erro) {
    throw erro;
  }
}

class Usuario {
  static async listarTodos() {
    const sql = 'SELECT * FROM usuario ORDER BY id DESC';
    return executarQuery(sql);
  }

  static async buscarPorId(id) {
    // Alterado de ? para $1
    const sql = 'SELECT * FROM usuario WHERE id = $1';
    const resultado = await executarQuery(sql, [id]);
    return resultado[0];
  }

  static async criar(dadosUsuario) {
    const {
      nome,
      email,
      curso,
      periodo,
      ativo,
      receber_noticias,
      tecnologias
    } = dadosUsuario;

    // Alterado de ? para $1, $2, $3...
    const sql = `
      INSERT INTO usuario
      (nome, email, curso, periodo, ativo, receber_noticias, tecnologias)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `;

    return executarQuery(sql, [
      nome,
      email,
      curso,
      periodo,
      ativo,
      receber_noticias,
      tecnologias
    ]);
  }

  static async atualizar(id, dadosUsuario) {
    const {
      nome,
      email,
      curso,
      periodo,
      ativo,
      receber_noticias,
      tecnologias
    } = dadosUsuario;

    // Alterado de ? para $1, $2, $3... e o ID sendo o $8
    const sql = `
      UPDATE usuario
      SET nome = $1, email = $2, curso = $3, periodo = $4, ativo = $5,
          receber_noticias = $6, tecnologias = $7
      WHERE id = $8
    `;

    return executarQuery(sql, [
      nome,
      email,
      curso,
      periodo,
      ativo,
      receber_noticias,
      tecnologias,
      id
    ]);
  }

  static async excluir(id) {
    // Alterado de ? para $1
    const sql = 'DELETE FROM usuario WHERE id = $1';
    return executarQuery(sql, [id]);
  }
}

module.exports = Usuario;