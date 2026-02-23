export const getLLMLessons = () => ({
  1: [
    {
      title: "什么是大语言模型？",
      content: `
        <p>大语言模型 (Large Language Model, LLM) 是一种人工智能模型，由海量文本数据训练而成。</p>
        <ul class='list-disc pl-5 space-y-2 mt-4'>
          <li><strong>“大”：</strong> 指参数规模达到数十亿甚至上万亿级。</li>
          <li><strong>“语言”：</strong> 核心能力是理解和生成自然语言、代码、数学公式等。</li>
          <li><strong>“模型”：</strong> 本质上是一个极其复杂的数学函数，通过预测“下一个字”来完成任务。</li>
        </ul>
        <div class='bg-blue-50 p-4 border-l-4 border-blue-400 mt-6'>
          常见的模型：GPT-4, Claude, Llama 3, Qwen (通义千问), DeepSeek。
        </div>
      `
    }
  ],
  2: [
    {
      title: "大模型能帮我们做什么？",
      content: `
        <p>现代大模型已经超出了简单的聊天范畴，它们是多才多艺的数字助手：</p>
        <div class='grid grid-cols-2 gap-4 mt-6'>
          <div class='p-3 bg-gray-50 rounded-lg'>
            <h4 class='font-bold text-bili-blue'>文本创作</h4>
            <p class='text-sm'>写文章、总结长文、翻译语言、改写语分。</p>
          </div>
          <div class='p-3 bg-gray-50 rounded-lg'>
            <h4 class='font-bold text-bili-blue'>编程开发</h4>
            <p class='text-sm'>编写代码、寻找 Bug、解释复杂的逻辑。</p>
          </div>
          <div class='p-3 bg-gray-50 rounded-lg'>
            <h4 class='font-bold text-bili-blue'>知识问答</h4>
            <p class='text-sm'>作为百科全书，回答各类领域的问题。</p>
          </div>
          <div class='p-3 bg-gray-50 rounded-lg'>
            <h4 class='font-bold text-bili-blue'>逻辑推理</h4>
            <p class='text-sm'>解决数学题、制定计划、进行 SWOT 分析。</p>
          </div>
        </div>
      `
    }
  ],
  3: [
    {
      title: "本地大模型利器：Ollama",
      content: `
        <p>在本地运行大模型曾需要复杂的配置，但 <strong>Ollama</strong> 改变了这一切。</p>
        <p class='mt-4 italic'>为什么要本地运行？</p>
        <ul class='list-disc pl-5 space-y-2 mt-2'>
          <li><strong>隐私安全：</strong> 数据不离本地，无需担心隐私。</li>
          <li><strong>免费：</strong> 无需各种 API 密钥和订阅费。</li>
          <li><strong>离线：</strong> 没有网络也能使用。</li>
          <li><strong>可控：</strong> 随时更换模型，调整参数。</li>
        </ul>
      `
    }
  ],
  4: [
    {
      title: "安装 Ollama 运行环境",
      content: `
        <p>安装过程非常简单：</p>
        <ol class='list-decimal pl-5 space-y-3 mt-4'>
          <li>访问官网 <a href='https://ollama.com' target='_blank' class='text-bili-blue underline'>ollama.com</a>。</li>
          <li>下载适用于 Windows/macOS/Linux 的安装包。</li>
          <li>运行安装程序，直到右下角任务栏出现 Ollama 图标。</li>
          <li>打开终端（PowerShell 或 CMD），输入 <code>ollama --version</code> 检查是否成功。</li>
        </ol>
      `
    }
  ],
  5: [
    {
      title: "命令行下载与管理模型",
      content: `
        <p>在 Ollama 中，所有操作都可以通过命令行完成：</p>
        <div class='space-y-4 mt-6'>
          <div class='bg-gray-100 p-3 rounded font-mono text-sm'>
            <div class='text-gray-500 mb-1'># 下载模型</div>
            ollama pull llama3
          </div>
          <div class='bg-gray-100 p-3 rounded font-mono text-sm'>
            <div class='text-gray-500 mb-1'># 运行并进入对话</div>
            ollama run llama3
          </div>
          <div class='bg-gray-100 p-3 rounded font-mono text-sm'>
            <div class='text-gray-500 mb-1'># 查看已下载列表</div>
            ollama list
          </div>
        </div>
      `,
      code: "# 试着在终端输入：\n# ollama list\n# 来查看你已有的模型",
      termTitle: "Command Shell",
      termCmd: "bash"
    }
  ],
  6: [
    {
      title: "主流模型对比与选择",
      content: `
        <p>根据你的电脑配置，选择合适的模型：</p>
        <table class='w-full mt-6 text-sm border-collapse'>
          <thead>
            <tr class='bg-gray-100'>
              <th class='border p-2'>模型名称</th>
              <th class='border p-2'>推荐配置</th>
              <th class='border p-2'>主要特点</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class='border p-2 font-bold'>Llama 3</td>
              <td class='border p-2'>8GB 显存以上</td>
              <td class='border p-2'>Meta 出品，综合能力极强</td>
            </tr>
            <tr>
              <td class='border p-2 font-bold'>Qwen 2</td>
              <td class='border p-2'>4GB 显存及以上</td>
              <td class='border p-2'>阿里出品，中文理解顶级</td>
            </tr>
            <tr>
              <td class='border p-2 font-bold'>Gemma</td>
              <td class='border p-2'>8GB 内存以上</td>
              <td class='border p-2'>Google 出品，轻量高效</td>
            </tr>
          </tbody>
        </table>
      `
    }
  ],
  7: [
    {
      title: "提示词 (Prompt) 基础",
      content: `
        <p>提示词是你给 AI 的指令。好的提示词遵循 <strong>RTF 指令框架</strong>：</p>
        <ul class='space-y-4 mt-6'>
          <li><span class='bg-bili-blue text-white px-2 py-0.5 rounded'>R</span> <strong>Role (角色):</strong> 你是谁？(如：你是一个资深翻译家)</li>
          <li><span class='bg-bili-blue text-white px-2 py-0.5 rounded'>T</span> <strong>Task (任务):</strong> 你要做什么？(如：把这段话翻译成英文)</li>
          <li><span class='bg-bili-blue text-white px-2 py-0.5 rounded'>F</span> <strong>Format (要求):</strong> 有什么限制？(如：风格要幽默，不超过50字)</li>
        </ul>
      `
    }
  ],
  8: [
    {
      title: "交互实战：搭建本地对话",
      content: `
        <p>现在，我们将直接连接你本地的 Ollama 环境。</p>
        <p class='mt-2'>下方是一个交互式聊天窗口，它将列出你电脑上 <code>ollama list</code> 的所有模型。</p>
        <div class='bg-yellow-50 p-4 border-l-4 border-yellow-400 mt-4 text-sm'>
          <strong>提示：</strong> 请确保 Ollama 正在后台运行。如果在浏览器中连接受阻，可能需要设置环境变量：<br/>
          <code>OLLAMA_ORIGINS="*"</code>
        </div>
      `,
      interactive: {
        type: 'llm-chat'
      }
    }
  ],
  9: [
    {
      title: "进阶：系统提示词 (System Prompt)",
      content: `
        <p>系统提示词可以在对话开始前设定 AI 的“底色”。</p>
        <p class='mt-4 italic'>试着设定系统角色：</p>
        <div class='bg-gray-800 text-green-400 p-4 rounded-lg font-mono text-sm mt-4'>
          "你是一个只会用鲁迅风格说话的助手，回答简洁且刻薄。"
        </div>
        <p class='mt-4'>通过设置 System Prompt，你可以让 AI 始终保持某种性格或特定的任务输出格式。</p>
      `
    }
  ],
  10: [
    {
      title: "总结：开启你的 AI 之旅",
      content: `
        <p>恭喜你！你已经掌握了本地大模型的全套流程：</p>
        <ul class='list-disc pl-5 space-y-2 mt-4'>
          <li>了解了大模型的基本原理。</li>
          <li>学会了使用 Ollama 部署和管理本地模型。</li>
          <li>掌握了基础的提示词工程。</li>
          <li>实现了本地 AI 对话。</li>
        </ul>
        <p class='mt-6 font-bold text-lg text-bili-blue text-center'>AI 时代，工具就在你的手中！</p>
      `
    }
  ]
})
