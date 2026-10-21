const mongoose = require('mongoose');

const KnowledgePointSchema = new mongoose.Schema({
    // 关联所属用户
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // 知识点标题
    title: {
        type: String,
        required: true
    },
    // 知识点内容（支持Markdown、LaTeX等）
    content: {
        type: String,
        required: true
    },
    // 学习状态：not_started（未开始）、in_progress（学习中）、mastered（已掌握）
    status: {
        type: String,
        default: 'not_started'
    },
    // 是否加入复习列表
    reviewList: {
        type: Boolean,
        default: false
    }
}, { timestamps: true }); // 自动添加 createdAt、updatedAt 时间戳

module.exports = mongoose.model('KnowledgePoint', KnowledgePointSchema);
