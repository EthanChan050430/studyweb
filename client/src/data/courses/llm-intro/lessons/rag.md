# 3-2：构建私有大脑 - RAG 知识库

👋 你好，未来的 AI 架构师！

想象一下，你有一个非常聪明但“没网”的学习搭子——大模型。它满腹经纶，但如果你问它关于“你”或者是“最近”的事情，它会显得束手无策。

<div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 20px; padding: 25px; margin: 24px 0; font-family: sans-serif; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
<div style="display: flex; flex-direction: column; gap: 15px;">
<div style="align-self: flex-end; background: #0071e3; color: white; padding: 10px 15px; border-radius: 15px 15px 0 15px; font-size: 13px; max-width: 80%;">嘿，你知道我昨天在秘密笔记本里写的那个“火星计划”的第一步是什么吗？</div>
<div style="align-self: flex-start; background: white; color: #1e293b; padding: 10px 15px; border-radius: 15px 15px 15px 0; font-size: 13px; max-width: 80%; border: 1px solid #e2e8f0; position: relative;">
<div style="margin-bottom: 5px;">🤖 <span style="font-weight: bold; font-size: 11px; color: #64748b;">AI 助手</span></div>
抱歉，作为一个大语言模型，我无法访问您的私人笔记本。我的知识库截止于 2023 年...
<div style="position: absolute; right: -10px; top: 0; font-size: 20px;">❓</div>
</div>
</div>
</div>

本章我们将学习如何给它装上 **“外置记忆”**——这就是 **RAG (检索增强生成)**。

---

## 痛点：大模型的“知识孤岛”

大模型虽然博学，但有两个致命伤：
1. **时效差**：它的知识停留在“训练结束”的那天。
2. **私密知识盲区**：它没读过你的私人笔记、代码库或公司的机密文档。

<div class="img-container">
  <img src="/images/rag_arch.png" alt="RAG Architecture" />
  <p class="img-caption">RAG 就像给 AI 佩戴了一副“实时搜索眼镜”</p>
</div>

**RAG 的妙计**：在它说话前，我们先去“私人图书馆”帮它查资料，然后把资料塞给它。这就像考试的时候，你给模型一张**开卷考试**的参考资料。

---

## 击碎“幻觉”：从胡编到实证

大语言模型有时会“一本正经地胡说八道”，这被称为**幻觉 (Hallucination)**。

<div style="display: flex; gap: 20px; margin: 24px 0;">
<div style="flex: 1; padding: 15px; background: #fff1f0; border-radius: 16px; border: 1px solid #ffccc7;">
<div style="font-size: 20px; margin-bottom: 8px;">😵‍💫 <b>纯 LLM (闭卷)</b></div>
<div style="font-size: 11px; color: #cf1322;">“我猜...小明昨晚吃的是红烧牛肉面？” (其实他在吃火锅)</div>
</div>
<div style="flex: 1; padding: 15px; background: #f6ffed; border-radius: 16px; border: 1px solid #b7eb8f;">
<div style="font-size: 20px; margin-bottom: 8px;">✅ <b>RAG (开卷)</b></div>
<div style="font-size: 11px; color: #389e0d;">“根据检索到的日记：小明昨天在重庆火锅店打卡。”</div>
</div>
</div>

RAG 强制模型必须基于**检索到的事实**回答。如果搜不到，它宁愿说“我不知道”，也不会乱编。

---

## 第一步：知识工厂 - 为什么要切分 (Chunking)？

模型的大脑有“输入上限”（上下文窗口）。你不能直接把整本《资治通鉴》扔给它。

<div style="text-align: center; padding: 30px; background: #f8fafc; border-radius: 24px; margin: 24px 0; border: 1px solid #e2e8f0;">
  <svg width="300" height="150" viewBox="0 0 300 150">
    <!-- Book -->
    <rect x="20" y="40" width="80" height="100" fill="#0071e3" rx="4" />
    <text x="60" y="95" text-anchor="middle" fill="white" font-size="12" font-weight="bold">长文档</text>
    <!-- Scissors Animation -->
    <g>
      <text x="120" y="80" font-size="24">✂️</text>
      <animateTransform attributeName="transform" type="translate" values="0,0; 0,-10; 0,0" dur="1s" repeatCount="indefinite" />
    </g>
    <!-- Chunks -->
    <rect x="180" y="30" width="100" height="20" fill="#dbeafe" stroke="#3b82f6" rx="2" />
    <rect x="180" y="60" width="100" height="20" fill="#dbeafe" stroke="#3b82f6" rx="2" />
    <rect x="180" y="90" width="100" height="20" fill="#dbeafe" stroke="#3b82f6" rx="2" />
    <rect x="180" y="120" width="100" height="20" fill="#dbeafe" stroke="#3b82f6" rx="2" />
  </svg>
  <p style="font-size: 12px; color: #64748b; margin-top: 15px;">我们需要把整块的知识切成“易消化”的小碎片</p>
</div>

**老师提醒**：切分时通常会保留一些**重叠 (Overlap)**，防止知识点刚好在中间被剪断，导致语义丢失。

---

## 第二步：灵魂映射 - 什么是 Embedding？

计算机不认识汉字，它只认识数字。Embedding 技术把每句话转换成一串坐标（向量）。

<div style="display: flex; flex-direction: column; align-items: center; padding: 25px; background: #0f172a; border-radius: 24px; margin: 24px 0; color: white;">
  <div style="width: 100%; display: flex; justify-content: space-around; margin-bottom: 20px;">
    <div style="text-align: center;">
      <div style="font-size: 24px;">🐱</div>
      <div style="font-family: monospace; font-size: 10px; color: #3b82f6;">[0.12, -0.8, 0.55...]</div>
    </div>
    <div style="font-size: 20px; align-self: center;">≈</div>
    <div style="text-align: center;">
      <div style="font-size: 24px;">🐈</div>
      <div style="font-family: monospace; font-size: 10px; color: #3b82f6;">[0.13, -0.79, 0.54...]</div>
    </div>
  </div>
  <p style="font-size: 12px; color: #94a3b8; line-height: 1.6;">
    意思相近的话，在数学空间里的距离也会很近。这就叫<b>语义搜索</b>，即使字面上完全不同，只要意思一样就能搜到。
  </p>
</div>

---

## 第三步：向量数据库 - 知识的储藏室

切好的碎片和算出维度的坐标，都需要存放在一个特殊的地方：**向量数据库**。

<div class="img-container">
  <img src="/images/vector_db.png" alt="Vector Database" />
  <p class="img-caption">常见的向量数据库有 ChromaDB, Milvus, Pinecone 等</p>
</div>

---

## 实验：手写一个“迷你检索器”

让我们用代码来看看，向量搜索是怎么“懂人心”的。

```experiment-terminal
{
  "code": "import math\n\n# 模拟向量（坐标）\nknowledge_base = {\n    '番茄炒蛋': [1.0, 0.9, 0.1],  # [食物, 红色, 科技]\n    '人工智能': [0.1, 0.2, 0.9], \n    '西红柿': [0.95, 0.85, 0.1] \n}\n\ndef similarity(v1, v2):\n    # 计算点与点的距离（简化逻辑）\n    return sum(a*b for a,b in zip(v1, v2))\n\nquery = '红色蔬菜'  \nquery_vector = [0.8, 0.8, 0.1]\n\nfor name, vec in knowledge_base.items():\n    score = similarity(query_vector, vec)\n    print(f'“{query}” 与 “{name}” 的相关度: {score:.2f}')\n\nprint('\\n[结论]: 即使字面没有“蔬菜”二字，系统也能通过坐标找到西红柿！')",
  "title": "语义检索模拟器",
  "command": "python script.py"
}
```

---

## 第四步：答案组装 - 提示词工程

这是最后一步。我们会给模型发一个这样的指令：

> “你是 AI 助手。请根据下方的**已知参考资料**，回答用户的问题。如果资料里没写，就说不知道。”
> 
> **参考资料：** [从数据库里搜出来的知识碎片]
> 
> **问题：** [用户提问]

<div style="background: #fdf2f8; border: 2px dashed #f472b6; border-radius: 16px; padding: 20px; margin: 24px 0;">
  <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
    <span style="font-size: 24px;">🔧</span>
    <b style="color: #9d174d;">底层逻辑</b>
  </div>
  <p style="font-size: 12px; color: #831843;">
    大模型并不是真的“学习”了你的文档，而是在对话时，你的程序<b>偷梁换柱</b>，把文档里的部分内容悄悄塞进了对话上下文里。
  </p>
</div>

---

## 决战重排序 (Re-ranking)

向量搜索虽然好，但有时会搜到一些“似是而非”的内容。此时需要一个**审稿人**（重排序模型）。

<div style="display: flex; flex-direction: column; gap: 10px; padding: 20px; background: white; border-radius: 20px; border: 2px solid #e2e8f0; margin: 24px 0;">
  <div style="padding: 10px; background: #fee2e2; border-radius: 8px; opacity: 0.7; font-size: 11px;">🔍 检索结果 1: 讲了苹果手机的电池 (向量匹配高)</div>
  <div style="padding: 10px; background: #dcfce7; border-radius: 8px; font-size: 11px;">🏆 检索结果 2: 讲了苹果树的种植 (Re-ranker 认为这才是用户要的)</div>
  <div style="text-align: center; color: #64748b; font-size: 20px;">↑</div>
  <div style="text-align: center; font-weight: bold; color: #0071e3;">用户问题: “这棵树怎么除虫？”</div>
</div>

---

## 实战演练：搭建你的 RAG 实验室

现在，试试在左侧输入你的“专属秘籍”，然后在右侧考考它。

```experiment-rag
{}
```

## RAG 完整流程大揭秘

我们将之前的所有步骤串起来，就得到了完整的 RAG “组合拳”：

<div style="text-align: center; padding: 25px; background: #f9fafb; border-radius: 20px; border: 1px solid #f1f5f9; margin: 24px 0;">
<svg width="100%" height="120" viewBox="0 0 400 120">
<rect x="20" y="40" width="60" height="40" rx="8" fill="#e2e8f0" /><text x="50" y="65" text-anchor="middle" font-size="10" font-weight="bold">1. 提问</text>
<path d="M80 60 L100 60" stroke="#0071e3" stroke-width="2" />
<rect x="100" y="40" width="60" height="40" rx="8" fill="#dbeafe" /><text x="130" y="65" text-anchor="middle" font-size="10" font-weight="bold" fill="#0071e3">2. 检索</text>
<path d="M160 60 L180 60" stroke="#0071e3" stroke-width="2" />
<rect x="180" y="40" width="60" height="40" rx="8" fill="#dcfce7" /><text x="210" y="65" text-anchor="middle" font-size="10" font-weight="bold" fill="#15803d">3. 组装</text>
<path d="M240 60 L260 60" stroke="#0071e3" stroke-width="2" />
<rect x="260" y="40" width="60" height="40" rx="8" fill="#fef9c3" /><text x="290" y="65" text-anchor="middle" font-size="10" font-weight="bold" fill="#854d0e">4. 生成</text>
<path d="M320 60 L340 60" stroke="#0071e3" stroke-width="2" />
<text x="360" y="65" font-size="20">✅</text>
</svg>
<p style="font-size: 12px; color: #64748b; font-weight: 600; margin-top: 10px;">从用户问题到精准答案，只需四步</p>
</div>

---

## 总结：RAG 的三大神力

| 特性 | 纯 LLM | RAG 加持 |
| :--- | :--- | :--- |
| **知识范围** | 仅限于训练集数据 | 无限扩展私有/最新数据 |
| **准确性** | 容易一本正经胡说 | 有据可查，降低幻觉 |
| **开发成本** | 微调模型贵且慢 | 实时更新，低成本部署 |

掌握了 RAG，你就能将 AI 变成真正的“个人智能管家”。准备好迎接下一个课题了吗？

<div style="text-align: center; margin-top: 30px;">
  <button style="background: #0071e3; color: white; border: none; padding: 12px 30px; border-radius: 50px; font-weight: bold; cursor: pointer; box-shadow: 0 4px 14px rgba(0,113,227,0.4);">
    完成本章，解锁下一关
  </button>
</div>
