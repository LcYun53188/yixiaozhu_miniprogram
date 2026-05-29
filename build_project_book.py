from pathlib import Path

from docx import Document
from docx.enum.section import WD_SECTION
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_CELL_VERTICAL_ALIGNMENT
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_BREAK, WD_LINE_SPACING
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Inches, Pt, RGBColor


ROOT = Path(r"E:\Project\SauAPP")
OUTPUT = ROOT / "益小助-项目书.docx"


BLUE = RGBColor(0x2E, 0x74, 0xB5)
DARK_BLUE = RGBColor(0x1F, 0x4D, 0x78)
GRAY = RGBColor(0x66, 0x66, 0x66)
LIGHT_FILL = "F4F6F9"
TABLE_HEADER_FILL = "E8EEF5"
BORDER = "B7C4D6"


def set_cell_shading(cell, fill):
    tc_pr = cell._tc.get_or_add_tcPr()
    shd = tc_pr.find(qn("w:shd"))
    if shd is None:
        shd = OxmlElement("w:shd")
        tc_pr.append(shd)
    shd.set(qn("w:fill"), fill)


def set_cell_width(cell, width_inches):
    cell.width = Inches(width_inches)
    tc_pr = cell._tc.get_or_add_tcPr()
    tc_w = tc_pr.find(qn("w:tcW"))
    if tc_w is None:
        tc_w = OxmlElement("w:tcW")
        tc_pr.append(tc_w)
    tc_w.set(qn("w:type"), "dxa")
    tc_w.set(qn("w:w"), str(int(width_inches * 1440)))


def set_table_borders(table, color=BORDER, size=8):
    tbl = table._tbl
    tbl_pr = tbl.tblPr
    borders = tbl_pr.first_child_found_in("w:tblBorders")
    if borders is None:
        borders = OxmlElement("w:tblBorders")
        tbl_pr.append(borders)
    for edge in ("top", "left", "bottom", "right", "insideH", "insideV"):
        el = borders.find(qn(f"w:{edge}"))
        if el is None:
            el = OxmlElement(f"w:{edge}")
            borders.append(el)
        el.set(qn("w:val"), "single")
        el.set(qn("w:sz"), str(size))
        el.set(qn("w:space"), "0")
        el.set(qn("w:color"), color)


def set_run_font(run, *, size=None, bold=None, italic=None, color=None, name="Calibri", east_asia="Microsoft YaHei"):
    run.font.name = name
    run._element.rPr.rFonts.set(qn("w:ascii"), name)
    run._element.rPr.rFonts.set(qn("w:hAnsi"), name)
    run._element.rPr.rFonts.set(qn("w:eastAsia"), east_asia)
    if size is not None:
        run.font.size = Pt(size)
    if bold is not None:
        run.bold = bold
    if italic is not None:
        run.italic = italic
    if color is not None:
        run.font.color.rgb = color


def style_paragraph(paragraph, *, align=WD_ALIGN_PARAGRAPH.JUSTIFY, before=0, after=8, line=1.333, first_line_chars=None):
    fmt = paragraph.paragraph_format
    fmt.alignment = align
    fmt.space_before = Pt(before)
    fmt.space_after = Pt(after)
    fmt.line_spacing_rule = WD_LINE_SPACING.MULTIPLE
    fmt.line_spacing = line
    if first_line_chars:
        fmt.first_line_indent = Pt(first_line_chars)


def add_body_para(doc, text, *, bold_prefix=None):
    p = doc.add_paragraph()
    style_paragraph(p)
    if bold_prefix and text.startswith(bold_prefix):
        prefix = p.add_run(bold_prefix)
        set_run_font(prefix, size=11, bold=True)
        rest = p.add_run(text[len(bold_prefix):])
        set_run_font(rest, size=11)
    else:
        run = p.add_run(text)
        set_run_font(run, size=11)
    return p


def add_heading(doc, text, level):
    p = doc.add_paragraph()
    fmt = p.paragraph_format
    if level == 1:
        fmt.space_before = Pt(18)
        fmt.space_after = Pt(10)
        size = 16
        color = BLUE
    elif level == 2:
        fmt.space_before = Pt(12)
        fmt.space_after = Pt(6)
        size = 13
        color = BLUE
    else:
        fmt.space_before = Pt(8)
        fmt.space_after = Pt(4)
        size = 12
        color = DARK_BLUE
    fmt.alignment = WD_ALIGN_PARAGRAPH.LEFT
    run = p.add_run(text)
    set_run_font(run, size=size, bold=True, color=color)
    return p


def add_bullets(doc, items):
    for item in items:
        p = doc.add_paragraph(style="List Bullet")
        fmt = p.paragraph_format
        fmt.space_before = Pt(0)
        fmt.space_after = Pt(4)
        fmt.line_spacing_rule = WD_LINE_SPACING.MULTIPLE
        fmt.line_spacing = 1.208
        run = p.add_run(item)
        set_run_font(run, size=11)


def add_numbered(doc, items):
    for item in items:
        p = doc.add_paragraph(style="List Number")
        fmt = p.paragraph_format
        fmt.space_before = Pt(0)
        fmt.space_after = Pt(4)
        fmt.line_spacing_rule = WD_LINE_SPACING.MULTIPLE
        fmt.line_spacing = 1.208
        run = p.add_run(item)
        set_run_font(run, size=11)


def add_simple_table(doc, headers, rows, widths):
    table = doc.add_table(rows=1, cols=len(headers))
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False
    set_table_borders(table)
    hdr = table.rows[0]
    for i, text in enumerate(headers):
        cell = hdr.cells[i]
        set_cell_width(cell, widths[i])
        cell.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.CENTER
        set_cell_shading(cell, TABLE_HEADER_FILL)
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        style_paragraph(p, align=WD_ALIGN_PARAGRAPH.CENTER, before=0, after=0, line=1.15)
        run = p.add_run(text)
        set_run_font(run, size=10.5, bold=True)
    for row in rows:
        tr = table.add_row()
        for i, text in enumerate(row):
            cell = tr.cells[i]
            set_cell_width(cell, widths[i])
            cell.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.CENTER
            p = cell.paragraphs[0]
            align = WD_ALIGN_PARAGRAPH.CENTER if widths[i] <= 1.2 else WD_ALIGN_PARAGRAPH.LEFT
            style_paragraph(p, align=align, before=0, after=0, line=1.15)
            run = p.add_run(str(text))
            set_run_font(run, size=10.5)
    return table


def add_note_box(doc, title, body):
    table = doc.add_table(rows=1, cols=1)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False
    set_table_borders(table, color="D9E2F3", size=6)
    cell = table.cell(0, 0)
    set_cell_width(cell, 6.5)
    set_cell_shading(cell, LIGHT_FILL)
    cell.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.CENTER
    p1 = cell.paragraphs[0]
    style_paragraph(p1, align=WD_ALIGN_PARAGRAPH.LEFT, before=0, after=3, line=1.15)
    r1 = p1.add_run(title)
    set_run_font(r1, size=11, bold=True, color=DARK_BLUE)
    p2 = cell.add_paragraph()
    style_paragraph(p2, align=WD_ALIGN_PARAGRAPH.LEFT, before=0, after=0, line=1.15)
    r2 = p2.add_run(body)
    set_run_font(r2, size=10.5)


def add_cover(doc):
    section = doc.sections[0]
    section.top_margin = Inches(1)
    section.bottom_margin = Inches(1)
    section.left_margin = Inches(1)
    section.right_margin = Inches(1)
    section.header_distance = Inches(0.492)
    section.footer_distance = Inches(0.492)

    for _ in range(5):
        doc.add_paragraph()

    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_after = Pt(8)
    r = p.add_run("计算机学院移动应用开发竞赛项目书")
    set_run_font(r, size=12, bold=True, color=GRAY)

    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_after = Pt(4)
    r = p.add_run("益小助")
    set_run_font(r, size=24, bold=True)

    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_after = Pt(12)
    r = p.add_run("基于 AI 的校园公益资源智能匹配小程序项目书")
    set_run_font(r, size=14, color=GRAY)

    table = doc.add_table(rows=4, cols=2)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False
    set_table_borders(table, color="D7DBE2", size=6)
    labels = ["团队名称", "项目负责人", "团队成员", "指导教师"]
    values = ["待填写", "待填写", "待填写", "待填写"]
    for i in range(4):
        set_cell_width(table.cell(i, 0), 1.6)
        set_cell_width(table.cell(i, 1), 4.4)
        for j in range(2):
            cell = table.cell(i, j)
            cell.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.CENTER
            p = cell.paragraphs[0]
            style_paragraph(p, align=WD_ALIGN_PARAGRAPH.LEFT, before=0, after=0, line=1.15)
            run = p.add_run(labels[i] if j == 0 else values[i])
            set_run_font(run, size=10.5, bold=(j == 0))
            if j == 0:
                set_cell_shading(cell, TABLE_HEADER_FILL)

    doc.add_paragraph()
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(18)
    r = p.add_run("沈阳航空航天大学")
    set_run_font(r, size=12, bold=True, color=DARK_BLUE)
    p2 = doc.add_paragraph()
    p2.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r2 = p2.add_run("2026 年 5 月")
    set_run_font(r2, size=12)


def add_section_break(doc):
    doc.add_page_break()


def build_doc():
    doc = Document()

    normal = doc.styles["Normal"]
    normal.font.name = "Calibri"
    normal._element.rPr.rFonts.set(qn("w:ascii"), "Calibri")
    normal._element.rPr.rFonts.set(qn("w:hAnsi"), "Calibri")
    normal._element.rPr.rFonts.set(qn("w:eastAsia"), "Microsoft YaHei")
    normal.font.size = Pt(11)

    add_cover(doc)
    add_section_break(doc)

    add_heading(doc, "一、项目概述", 1)
    add_body_para(doc, "“益小助”是一个面向校园公益场景的微信小程序项目，聚焦旧书教材流转、闲置物资捐赠、失物招领、爱心帮扶与公益活动等高频需求，利用 AI 提升信息整理、内容审核与供需匹配效率。项目目标是在校内构建一个轻量、可信、易传播的公益资源智能匹配平台，帮助闲置资源更快地流转到真正需要的人手中。")
    add_body_para(doc, "项目围绕“登录、验证、发布、审核、匹配、对接、反馈”构建完整业务闭环，既符合“AI 赋能·智创未来”的竞赛主题，也具备清晰的移动端落地价值。现阶段项目已经形成前端小程序、后端服务、数据库脚本和配套设计文档的完整骨架，并补充了真实微信登录、学号姓名验证、管理员邀请码和智能识别辅助等能力，具备继续完善并参与展示答辩的条件。")

    add_heading(doc, "二、项目背景与建设意义", 1)
    add_body_para(doc, "在校园日常生活中，大量教材、生活物资和失物信息通过群聊、朋友圈或线下告示进行传播。这类方式虽然使用门槛低，但普遍存在信息分散、检索困难、时效性差、真假难辨以及需求匹配效率低等问题，导致许多本可快速流转的公益资源被闲置，真正急需帮助的同学也难以及时获得有效信息。")
    add_body_para(doc, "“益小助”尝试以微信小程序作为服务载体，结合 AI 的文本理解、标签提取、内容优化与风险识别能力，将原本碎片化的校园公益资源整合进统一平台。项目的建设意义主要体现在三个层面：一是提升校园闲置资源利用率，减少浪费；二是增强校园互助氛围，提升学生公益参与感；三是验证 AI 在真实校园服务场景中的应用价值，为后续扩展到更广泛的校园服务平台提供基础。")

    add_heading(doc, "三、目标用户与应用场景", 1)
    add_body_para(doc, "项目的核心用户群体为在校本科生，同时兼顾学生组织、志愿服务团队以及校园审核管理人员。系统主要面向以下场景：")
    add_bullets(
        doc,
        [
            "旧书教材转赠：毕业生或高年级学生将教材、复习资料转赠给有需要的低年级学生。",
            "闲置生活物资捐赠：对衣物、台灯、文具、小家电等闲置物资进行爱心流转。",
            "失物招领：集中发布丢失和拾获信息，提高寻回效率。",
            "爱心帮扶：对临时性、阶段性的学习或生活求助需求进行信息汇聚与匹配。",
            "公益活动：为校园公益活动提供报名、宣传和资源协调入口。"
        ],
    )
    add_note_box(doc, "项目定位说明", "比赛版本优先聚焦“旧书教材 + 闲置物资 + 失物招领 + 爱心帮扶”四类核心场景，以保证业务闭环完整和开发可控；公益活动模块可作为后续扩展功能。")

    add_heading(doc, "四、项目目标与核心价值", 1)
    add_numbered(
        doc,
        [
            "建立统一的信息发布入口，减少校园公益资源传播碎片化问题。",
            "通过 AI 自动分类、标签提取与描述优化，降低用户发布成本，提高信息质量。",
            "通过智能匹配与状态流转机制，提升供需双方的对接效率。",
            "通过审核和风险识别机制，提升平台可信度与内容安全水平。",
            "形成可演示、可迭代、可扩展的校园公益服务小程序原型，为后续省赛或实际推广打下基础。"
        ],
    )

    add_heading(doc, "五、系统总体方案", 1)
    add_body_para(doc, "系统采用“小程序前端 + RESTful 后端服务 + MySQL 数据库 + AI 接口服务”的前后端分离架构。前端负责页面展示和交互体验，后端负责权限控制、业务逻辑和 AI 调度，数据库负责核心业务数据持久化，AI 层负责文本分类、标签提取、文案优化、风险识别与匹配推荐等能力。")
    add_simple_table(
        doc,
        ["层级", "组成", "主要职责"],
        [
            ["表现层", "微信小程序前端", "完成登录、发布、浏览、匹配、消息、个人中心与后台页面交互"],
            ["业务层", "Node.js + Express", "实现用户、资源、需求、审核、匹配、消息、收藏和统计等接口"],
            ["数据层", "MySQL", "保存用户、资源、需求、审核记录、匹配记录和消息记录等核心数据"],
            ["AI 能力层", "第三方大模型 API + 规则兜底", "实现文本理解、内容优化、风险识别和推荐解释"]
        ],
        [1.0, 1.7, 3.8],
    )

    add_heading(doc, "六、核心功能设计", 1)
    add_simple_table(
        doc,
        ["功能模块", "功能说明", "比赛优先级"],
        [
            ["用户登录", "基于微信授权识别用户身份，支持真实微信登录与演示回退", "高"],
            ["身份验证与授权", "支持学号姓名验证、一次性管理员邀请码兑换与角色升级", "高"],
            ["资源/需求发布", "支持发布“我有资源”与“我需要资源”两类信息，并填写标题、描述、图片、联系方式等", "高"],
            ["浏览与搜索", "支持按分类、关键词、时间和状态筛选信息", "高"],
            ["AI 辅助发布", "自动完成分类、标签提取、文案优化、ISBN 扫码辅助和图片识别建议", "高"],
            ["审核管理", "管理员对资源和需求进行通过、驳回与异常处理", "高"],
            ["智能匹配", "审核通过后生成供需匹配结果与匹配原因", "高"],
            ["消息通知", "向用户推送审核结果、匹配结果和状态变化", "中"],
            ["收藏与统计", "支持收藏常用资源，后台查看平台概览数据", "中"]
        ],
        [1.2, 4.2, 1.1],
    )

    add_heading(doc, "七、AI 接入与智能化设计", 1)
    add_body_para(doc, "项目的 AI 能力采用 API 方式接入，而不是在本地部署大模型。这样做的主要原因是比赛周期较短，API 接入开发速度更快、模型效果更稳定、部署和维护成本更低，更适合学生团队在有限时间内完成一个可展示、可答辩的版本。")
    add_body_para(doc, "在系统实现中，所有 AI 调用都通过后端统一封装。前端只负责提交文本或图片，后端完成输入预处理、Prompt 组织、AI 接口调用、结果标准化与缓存降级处理，从而避免前端直接依赖具体模型接口。")
    add_simple_table(
        doc,
        ["AI 子能力", "作用场景", "输出结果"],
        [
            ["文本分类", "用户发布资源或需求时", "返回所属分类与置信度"],
            ["标签提取", "用户录入描述后", "返回关键词、适用对象和标签集合"],
            ["文案优化", "用户描述过短或表达不清时", "返回更规范、可读性更高的描述文本"],
            ["风险识别", "审核前预处理", "返回风险等级和风险原因"],
            ["匹配推荐", "审核通过后", "返回匹配分数与推荐原因"],
            ["图片辅助识别", "上传图片时", "返回物资类别建议和辅助标签"],
            ["ISBN 扫码辅助", "扫描教材条码时", "返回教材标题、分类与标签建议"]
        ],
        [1.4, 2.2, 2.9],
    )
    add_note_box(doc, "AI 落地策略", "比赛版本优先完成文本分类、标签提取和文案优化，再逐步补充风险识别与匹配推荐；当 AI 接口调用失败时，系统回退到关键词和规则引擎，保证主流程不中断。")

    add_heading(doc, "八、业务流程设计", 1)
    add_numbered(
        doc,
        [
            "用户通过微信授权登录系统，系统根据角色展示普通用户端或管理员端入口；未配置微信参数时可回退到演示登录。",
            "普通用户可先在设置页完成学号姓名验证，并在需要时通过一次性管理员邀请码升级为管理员。",
            "普通用户在发布页填写资源或需求信息，并触发 AI 分类、标签提取、文案优化、ISBN 扫码或图片识别辅助。",
            "信息提交后进入待审核状态，管理员结合 AI 风险提示完成通过或驳回处理。",
            "审核通过后，后端基于分类、标签和相似度生成匹配记录，并向用户推送消息通知。",
            "用户查看匹配结果后进行联系和对接，状态可从“待匹配”推进到“对接中”和“已完成”。",
            "平台记录全过程数据，为后续统计分析、信誉建设与功能扩展提供基础。"
        ],
    )

    add_heading(doc, "九、数据库与接口设计", 1)
    add_body_para(doc, "数据库设计以比赛落地版本为边界，优先覆盖用户、资源、需求、审核、匹配与消息通知等核心实体。当前项目已在 `database/schema.sql` 与 `database/seed.sql` 中提供 MySQL 建表脚本和演示数据，便于快速搭建本地环境。")
    add_simple_table(
        doc,
        ["核心数据表", "主要字段", "用途"],
        [
            ["user", "openid、nickname、student_no、real_name、identity_verified、role、credit_score", "存储普通用户、管理员和超级管理员信息"],
            ["resource", "title、description、category、tags、image_urls、review_status、flow_status", "存储“我有资源”记录"],
            ["need", "title、description、category、tags、urgency_level、review_status", "存储“我需要资源”记录"],
            ["match_record", "resource_id、need_id、match_score、match_reason、status", "存储资源与需求的匹配结果"],
            ["review_record", "target_type、target_id、review_status、review_reason、reviewer_id", "存储审核行为"],
            ["message", "message_type、title、content、is_read", "存储审核、匹配和状态变化通知"],
            ["admin_invite_code", "invite_code、used、disabled、used_by、used_at", "存储一次性管理员邀请码状态"],
            ["feedback", "match_id、from_user_id、to_user_id、rating、credit_delta", "存储评价与信誉变化记录"]
        ],
        [1.4, 3.0, 2.1],
    )
    add_body_para(doc, "其中，`identity_verified` 与 `admin_invite_code` 共同构成当前版本的权限治理基础，分别用于完成学号姓名验证和一次性管理员授权。评价闭环则通过 `feedback`、`credit_score` 与 `rating_count` 等字段完成信誉沉淀。")
    add_body_para(doc, "接口方面，系统已经完成用户、资源、需求、AI、审核、匹配、消息、收藏和后台统计等模块的接口规划。后端以 `code + message + data` 作为统一返回结构，前端通过固定 API 前缀进行调用，便于后续联调和错误处理。")

    add_heading(doc, "十、当前项目实现情况", 1)
    add_body_para(doc, "根据现有工程目录和开发说明，项目已完成比赛版本的基础骨架搭建，具备继续深化的良好起点。当前实现情况如下：")
    add_bullets(
        doc,
        [
            "前端小程序目录 `miniprogram` 已包含首页、分类、发布、匹配、详情、消息、我的、设置和后台管理页面结构。",
            "后端目录 `backend` 已完成 Node.js + Express 服务骨架，并支持本地启动和 Docker 开发方式。",
            "数据库目录 `database` 已提供 MySQL 建表脚本、管理员邀请码迁移脚本与种子数据。",
            "项目根目录已沉淀需求、UI 原型、项目大纲和开发细节等 Markdown 文档。",
            "当前版本已支持发布页最多 3 张图片的选择、预览与删除，并可在详情页进行图片展示。",
            "当前版本已支持真实微信登录与演示回退、学号姓名验证、管理员邀请码兑换。",
            "当前版本已支持 ISBN 扫码辅助与图片识别辅助录入，便于教材和物品信息快速填充。",
            "当前后端默认使用内存数据仓库，便于快速联调和演示；后续可平滑切换到 MySQL。"
        ],
    )
    add_simple_table(
        doc,
        ["目录", "当前内容", "说明"],
        [
            ["backend", "Node.js + Express 服务、Dockerfile、环境变量示例", "负责接口、权限、审核和匹配逻辑"],
            ["miniprogram", "小程序页面、组件和 API 调用代码", "负责用户端和管理员端页面展示"],
            ["database", "schema.sql、seed.sql", "负责 MySQL 结构与演示数据初始化"],
            ["docs", "开发说明、Docker 排障说明", "用于指导部署、联调与演示准备"],
        ],
        [1.2, 2.6, 2.7],
    )

    add_heading(doc, "十一、开发计划与任务拆分", 1)
    add_body_para(doc, "为保证比赛版本按时交付，建议团队采用并行开发方式，将任务分为前端、小程序管理端、后端与 AI/文档四个方向同步推进。")
    add_simple_table(
        doc,
        ["阶段", "时间重点", "主要任务"],
        [
            ["阶段一", "项目骨架与环境准备", "完成前后端项目初始化、数据库准备、登录与角色识别"],
            ["阶段二", "核心业务闭环", "完成资源/需求发布、列表详情、管理员审核与状态流转"],
            ["阶段三", "AI 能力接入", "接入文本分类、标签提取、文案优化、风险识别与匹配推荐"],
            ["阶段四", "联调与打磨", "补充消息通知、空状态、异常提示、演示账号与测试数据"],
            ["阶段五", "竞赛材料交付", "完成项目书、PPT、演示视频与答辩话术准备"]
        ],
        [1.0, 1.6, 3.9],
    )
    add_bullets(
        doc,
        [
            "前端负责人：完成首页、发布页、详情页、匹配页、我的页面和基础交互优化。",
            "管理员端负责人：完成审核列表、通过驳回、统计概览和状态流转展示。",
            "后端负责人：完成接口实现、权限控制、审核逻辑、匹配逻辑和数据库接入。",
            "AI 与材料负责人：完成 AI 接口封装、Prompt 整理、测试数据准备和参赛文档整理。"
        ],
    )

    add_heading(doc, "十二、技术可行性、风险与对策", 1)
    add_body_para(doc, "从技术实现角度看，本项目核心逻辑以信息发布、审核和匹配为主，业务边界清晰，前端和后端均属于常见的管理与服务型应用形态，适合学生团队分工协作完成。AI 部分采用 API 接入和规则兜底的方式，可有效降低因模型部署而带来的环境与算力风险。")
    add_simple_table(
        doc,
        ["潜在风险", "影响", "应对策略"],
        [
            ["开发范围失控", "功能过多导致核心闭环无法按时完成", "优先保证“发布-审核-匹配-反馈”四步主流程"],
            ["AI 接口不稳定", "发布辅助或推荐结果可能失败", "增加缓存与规则降级，不阻塞主流程"],
            ["联调时间不足", "前后端功能接口对不上", "尽早冻结接口清单并使用演示数据联调"],
            ["演示数据不足", "答辩时系统内容空泛", "提前准备资源、需求、审核和匹配样例数据"],
            ["环境配置问题", "现场运行或录屏失败", "同时准备本地运行方案和 Docker 演示环境"]
        ],
        [1.6, 1.6, 3.3],
    )

    add_heading(doc, "十三、预期成果与推广价值", 1)
    add_body_para(doc, "项目预期形成以下成果：一是一个可运行的微信小程序原型或比赛展示版系统；二是一套完整的项目设计文档、项目书和答辩材料；三是一段 3 分钟以内的演示视频；四是一套可用于现场演示的测试账号与样例数据。")
    add_body_para(doc, "从推广价值看，“益小助”不仅适用于当前校级选拔赛，也具备向学院、社团和更大范围校园服务系统扩展的潜力。后续可继续增加管理员申请、地图定位、公益活动报名、信用积分和数据分析看板等能力，使其逐步从比赛作品成长为可落地的校园公益服务工具。")

    add_heading(doc, "十四、结论", 1)
    add_body_para(doc, "“益小助”项目以真实校园需求为基础，以微信小程序为载体，以 AI 智能能力为增益，围绕校园公益资源流转构建了较完整的业务闭环。项目主题明确、用户清晰、技术方案可行，当前又已经拥有较完善的工程骨架和配套文档，因此具有较强的参赛可行性和后续完善空间。")
    add_body_para(doc, "综合来看，该项目适合作为移动应用开发竞赛中的微信小程序赛道作品继续推进。建议后续保持“小而完整”的开发策略，优先做深核心场景与关键 AI 能力，在保证系统能跑、能讲、能演示的基础上，再逐步增强页面表现与扩展功能。")

    add_heading(doc, "十五、当前版本更新说明", 1)
    add_body_para(doc, "为保证项目书与当前项目实现保持一致，现对最近补充的图片上传、用户评估价、评价信誉等能力进行同步说明。")
    add_simple_table(
        doc,
        ["更新项", "当前实现或设计说明", "项目价值"],
        [
            ["图片上传", "发布页支持最多 3 张图片的选择、预览与删除，详情页支持图片展示与大图预览", "提高信息真实性和展示完整度"],
            ["身份验证与授权", "设置页支持学号姓名验证与一次性管理员邀请码兑换", "保证平台治理入口可信可控"],
            ["智能识别辅助", "发布页支持 ISBN 扫码、相机识别物品和上传图片识别", "降低录入成本，提升比赛展示亮点"],
            ["评价与信誉", "完成对接后支持星级评价、文字评价和信誉积分更新", "增强平台可信度并沉淀用户信用数据"],
            ["Docker 环境", "已提供 backend、mysql、phpMyAdmin 一体化开发环境", "降低联调门槛，提升演示稳定性"]
        ],
        [1.2, 3.5, 1.8],
    )
    add_body_para(doc, "其中，身份验证和管理员邀请码使平台具备了更完整的角色治理路径：普通用户先完成学号姓名验证，再通过一次性邀请码升级为管理员；首个超级管理员则由部署阶段手动指定，便于控制后台权限扩散。")
    add_body_para(doc, "关于“用户评估价”，当前项目材料仍将其作为可扩展展示字段保留，用于公益资源的参考价值说明；若后续与正式数据库持久化完全对齐，建议再在 `resource` 与 `need` 表中增加 `estimated_price` 字段，以保持产品说明、接口设计和系统实现的一致性。")

    # Footer page number text
    for sec in doc.sections:
        footer = sec.footer
        p = footer.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        r = p.add_run("益小助项目书")
        set_run_font(r, size=9, color=GRAY)

    doc.save(OUTPUT)


if __name__ == "__main__":
    build_doc()
