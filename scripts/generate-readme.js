const fs = require('fs');
const path = require('path');

const ONLINE_URL = process.env.ONLINE_URL || 'https://longcoderx.github.io/coding-plan-page/';
const FOOTER = process.env.FOOTER || '由 LongCoderX 维护';

// 读取数据文件
const configPath = path.join(__dirname, '../config.json');
const plansPath = path.join(__dirname, '../plans.json');

const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const plans = JSON.parse(fs.readFileSync(plansPath, 'utf8'));

// 格式化价格
function formatPrice(price) {
    if (price === '-') return '-';
    if (typeof price === 'number') {
        return `¥${price}`;
    }
    return price;
}

// 格式化划线价格
function formatStrikethrough(price, originalPrice) {
    if (price === '-') return '-';
    if (typeof price === 'number' && typeof originalPrice === 'number') {
        const priceStr = Number.isInteger(price) ? price : price.toFixed(0);
        const originalStr = Number.isInteger(originalPrice) ? originalPrice : originalPrice.toFixed(0);
        if (price < originalPrice) {
            return `¥${priceStr} ~~${originalStr}~~`;
        }
        return `¥${priceStr}`;
    }
    return formatPrice(price);
}

// 清理表格单元格内容
function escapeTableCell(text) {
    if (!text) return '-';
    return String(text).replace(/\n/g, ' ').trim() || '-';
}

// 计算原始价格
function getOriginalPrice(currentPrice, multiplier) {
    if (currentPrice === '-' || typeof currentPrice !== 'number') return null;
    return currentPrice * multiplier;
}

// 生成套餐对比表
function generateTable(plans) {
    let md = `| 平台 | 套餐 | 链接 | 首月价格 | 连续包月 | 连续包季 | 连续包年 | 支持模型 | 5小时请求数 | 每周请求数 | 每月总请求数 | 其他权益 | 备注 |\n`;
    md += `|------|------|---------|---------|---------|---------|---------|---------|-----------|-----------|-----------|---------|------|\n`;

    plans.forEach(plan => {
        const vendor = plan.vendor;
        const planName = plan.plan;
        const link = `[跳转](${plan.action})`;
        const firstMonth = formatPrice(plan.firstMonthPrice);
        const monthly = formatPrice(plan.monthlyPrice);
        const quarterly = plan.quarterlyPrice !== '-'
            ? formatStrikethrough(plan.quarterlyPrice, getOriginalPrice(plan.monthlyPrice, 3)) + ' / 季'
            : '- / 季';
        const yearly = plan.yearlyPrice !== '-'
            ? formatStrikethrough(plan.yearlyPrice, getOriginalPrice(plan.monthlyPrice, 12)) + ' / 年'
            : '- / 年';
        const models = plan.models.join(', ');
        const fiveHoursRequests = plan.fiveHoursRequests?.toLocaleString() || '未公开';
        const weeklyRequests = plan.weeklyRequests?.toLocaleString() || '-';
        const monthlyRequests = plan.monthlyRequests?.toLocaleString() || '未公开';
        const benefits = escapeTableCell(plan.benefits?.join(', '));
        const note = escapeTableCell(plan.note);

        md += `| ${vendor} | ${planName} | ${link} | ${firstMonth} | ${monthly} | ${quarterly} | ${yearly} | ${models} | ${fiveHoursRequests} | ${weeklyRequests} | ${monthlyRequests} | ${benefits} | ${note} |\n`;
    });

    return md;
}

// 生成完整 README
function generateReadme() {
    const { notes } = config;

    let md = `# AI Coding Plan 对比工具

## 📖 简介

${config.header.subtitle}

${config.header.models}

### 在线访问

直接访问：[${ONLINE_URL}](${ONLINE_URL})

## 📋 套餐对比表

${generateTable(plans)}

💡 **说明**

${notes.map(n => `- ${n}`).join('\n')}

## 🤝 贡献

欢迎提交 Issue 或 Pull Request 来完善本项目的数据和功能。

---

> ${FOOTER}
`;

    return md;
}

// 主函数
function main() {
    const readme = generateReadme();

    const outputPath = path.join(__dirname, '../README.md');
    fs.writeFileSync(outputPath, readme, 'utf8');

    console.log('README.md 已生成');
}

main();