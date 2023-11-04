const express = require('express');
const pool = require('./db');
const Produto = require('./product');

const router = express.Router();

// Listar todos os produtos
router.get('/product', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM produto');
    const produtos = result.rows.map((row) => {
      return new Produto(row.id, row.nome, row.validade);
    });
    res.json(produtos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar produtos' });
  }
});

// Obter um produto pelo ID
router.get('/produtc/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const result = await pool.query('SELECT * FROM produto WHERE id = $1', [id]);
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
  const { nome, validade} = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO produtos (nome, descricao, preco, quantidade) VALUES ($1, $2, $3, $4) RETURNING *',
      [nome, validade]
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
  const { nome, validade} = req.body;
  try {
    const result = await pool.query(
      'UPDATE produto SET nome = $1, descricao = $2, preco = $3, quantidade = $4 WHERE id = $5 RETURNING *',
      [nome, descricao, preco, quantidade, id]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Produto não encontrado' });
    } else {
      const row = result.rows[0];
      const produto = new Produto(row.id, row.nome, row.descricao, row.preco, row.quantidade);
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

