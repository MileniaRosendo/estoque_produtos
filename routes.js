const express = require('express');
const pool = require('./db');
const Produto = require('./product');


const router = express.Router();

// Listar todos os produtos
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM produtos');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar produtos' });
  }
});


// Obter um produto pelo ID
router.get('/product/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const result = await pool.query('SELECT * FROM produtos WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Produto não encontrado' });
    } else {
      const row = result.rows[0];
      const produto = new Produto(row.id, row.nome, row.validade);
      res.json(produto);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar produto' });
  }
});

// Criar um novo produto
router.post('/product', async (req, res) => {
  const { nome, validade } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO produtos (id, nome, validade) VALUES ($1, $2, $3) RETURNING *',
      [id, nome, validade]
    );
    const row = result.rows[0];
    const produto = new Produto(row.id, row.nome, row.validade);
    res.status(201).json(produto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar produto' });
  }
});

// Atualizar um produto
router.put('/product/:id', async (req, res) => {
  const id = req.params.id;
  const { nome, validade } = req.body;
  try {
    const result = await pool.query(
      'UPDATE produtos SET nome = $1, validade = $2 WHERE id = $3 RETURNING *',
      [nome, validade, id]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Produto não encontrado' });
    } else {
      const row = result.rows[0];
      const produto = new Produto(row.id, row.nome, row.validade);
      res.json(produto);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao atualizar produto' });
  }
});

// Deletar um produto
router.delete('/product/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const result = await pool.query('DELETE FROM produtos WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      res.status(404).json({ error: 'Produto não encontrado' });
    } else {
      res.json({ message: 'Produto excluído com sucesso' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao excluir produto' });
  }
});

module.exports = router;
