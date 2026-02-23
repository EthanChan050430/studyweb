export const getPythonLessons = () => ({
  1: [
    { 
      title: "什么是 Python?", 
      content: "Python 是一种流行的高级编程语言，以其简洁明了的语法著称。其设计哲学强调代码的可读性。" 
    },
    { 
      title: "第一个程序：Hello World", 
      content: "在编程界，传统的第一个程序总是输出 'Hello World'。这能帮你确认 Python 环境是否已正确安装。", 
      code: "print('Hello, Python World!')\nprint('恭喜你，环境配置成功！')",
      termTitle: "hello_world.py",
      termCmd: "python hello_world.py"
    }
  ],
  2: [
    { 
      title: "变量与赋值", 
      content: "变量类似于存储信息的容器。在 Python 中，你不需要像 C++ 或 Java 那样声明类型，直接赋值即可。", 
      code: "name = 'GitHub Copilot'\nage = 1\nprint(f'我是{name}, 我诞生于 AI 时代。')",
      termTitle: "variables.py",
      termCmd: "python variables.py"
    },
    { 
      title: "基本数据类型", 
      content: "Python 自动识别类型：整数 (int)、浮点数 (float) 和字符串 (str)。", 
      code: "pi = 3.14159\nradius = 5\narea = pi * (radius ** 2)\nprint(f'半径为{radius}的圆面积是: {area}')",
      termTitle: "data_types.py",
      termCmd: "python types_calc.py"
    }
  ],
  3: [
    { 
      title: "逻辑判断 (If...Else)", 
      content: "通过 <code>if</code> 语句，你可以让程序在不同条件下执行不同的任务。", 
      code: "temperature = 30\nif temperature > 28:\n    print('天气很热，请注意防暑。')\nelse:\n    print('气温适宜，祝你有个愉快的一天。')",
      termTitle: "weather_ai.py",
      termCmd: "python weather_check.py"
    }
  ],
  4: [
    { 
      title: "循环结构", 
      content: "重复是计算机的强项。<code>for</code> 循环通常用于遍历序列。", 
      code: "print('开始倒计时：')\nfor i in [3, 2, 1]:\n    print(f'...{i}')\nprint('发射！🚀')",
      termTitle: "countdown.py",
      termCmd: "python launch_sequence.py"
    }
  ],
  5: [
    { 
      title: "数组容器：列表 (List)", 
      content: "列表是一个有序的集合，可以随时添加和删除其中的元素。", 
      code: "tools = ['Python', 'PyTorch', 'Vue']\ntools.append('Tailwind')\nprint(f'我的技术栈目前有: {tools}')",
      termTitle: "list_manager.py",
      termCmd: "python manage_stack.py"
    }
  ],
  6: [
    { 
      title: "代码封装：函数", 
      content: "使用 <code>def</code> 关键字定义函数。", 
      code: "def make_coffee(style='美式'):\n    return f'正在为你制作一杯: {style}咖啡 ☕'\n\nprint(make_coffee('拿铁'))",
      termTitle: "coffee_machine.py",
      termCmd: "python coffee_service.py"
    }
  ],
  7: [
    { 
      title: "导入模块", 
      content: "Python 引用标准库。", 
      code: "import random\nlucky = random.randint(1, 100)\nprint(f'幸运数字: {lucky}')",
      termTitle: "random_gen.py",
      termCmd: "python get_lucky.py"
    }
  ],
  8: [
    { 
      title: "持久化存储：读写文件", 
      content: "存入硬盘文件。", 
      code: "with open('note.txt', 'w', encoding='utf-8') as f:\n    f.write('Python Is Power!')\nprint('数据已成功持久化。')",
      termTitle: "file_io.py",
      termCmd: "python save_data.py"
    }
  ],
  9: [
    { 
      title: "项目：BMI 计算器", 
      content: "做一个体质指数(BMI)计算器。", 
      code: "w, h = 70, 1.75\nbmi = w / (h*h)\nprint(f'您的 BMI 是: {bmi:.2f}')",
      termTitle: "health_tool.py",
      termCmd: "python bmi_app.py"
    }
  ],
  10: [
    { 
      title: "综合实战：TODO", 
      content: "模拟一个待办事项的管理逻辑。", 
      code: "todos = ['学Python', '写Vue']\nfor i, t in enumerate(todos, 1):\n    print(f'{i}. {t}')",
      termTitle: "todo_backend.py",
      termCmd: "python start_todo_server.py"
    }
  ]
})
