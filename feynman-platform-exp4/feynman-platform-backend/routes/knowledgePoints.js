const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const KnowledgePoint = require('../models/KnowledgePoint');

// @route   POST /api/knowledge-points
// @desc    创建一个新的知识点
// @access  Private（需要登录）
router.post('/', auth, async (req, res) => {
    try {
        const { title, content } = req.body;

        const newKp = new KnowledgePoint({
            title,
            content,
            user: req.user.id // 从认证中间件获取当前用户ID
        });

        const kp = await newKp.save();
        res.json(kp);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: '服务器错误' });
    }
});

// @route   GET /api/knowledge-points
// @desc    获取当前用户的所有知识点
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        // 按创建时间倒序排列，最新的在前面
        const kps = await KnowledgePoint.find({ user: req.user.id })
            .sort({ createdAt: -1 });
        res.json(kps);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: '服务器错误' });
    }
});

// @route   GET /api/knowledge-points/:id
// @desc    获取单个知识点详情
// @access  Private
router.get('/:id', auth, async (req, res) => {
    try {
        const kp = await KnowledgePoint.findById(req.params.id);
        if (!kp) {
            return res.status(404).json({ message: '知识点不存在' });
        }

        // 校验权限：只能查看自己的知识点
        if (kp.user.toString() !== req.user.id) {
            return res.status(401).json({ message: '无权限访问' });
        }

        res.json(kp);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: '服务器错误' });
    }
});

// @route   PUT /api/knowledge-points/:id
// @desc    更新一个知识点
// @access  Private
router.put('/:id', auth, async (req, res) => {
    try {
        let kp = await KnowledgePoint.findById(req.params.id);
        if (!kp) {
            return res.status(404).json({ message: '知识点不存在' });
        }

        // 校验权限：只能修改自己的知识点
        if (kp.user.toString() !== req.user.id) {
            return res.status(401).json({ message: '无权限修改' });
        }

        const { title, content, status, reviewList } = req.body;
        kp = await KnowledgePoint.findByIdAndUpdate(
            req.params.id,
            { $set: { title, content, status, reviewList } },
            { new: true } // 返回更新后的文档
        );

        res.json(kp);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: '服务器错误' });
    }
});

// @route   DELETE /api/knowledge-points/:id
// @desc    删除一个知识点
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    let kp = await KnowledgePoint.findById(req.params.id);
    if (!kp) {
      return res.status(404).json({ message: '知识点不存在' });
    }

    // 校验权限：只能删除自己的知识点
    if (kp.user.toString() !== req.user.id) {
      return res.status(401).json({ message: '无权限删除' });
    }

    await KnowledgePoint.findByIdAndDelete(req.params.id);
    res.json({ message: '知识点已删除' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: '服务器错误' });
  }
});


module.exports = router;
