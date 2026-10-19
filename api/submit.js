import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // 跨域设置
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  if (req.method !== 'POST') {
    return res.status(405).json({msg: '仅支持POST提交'});
  }

  const {name, email, message} = req.body;

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  try {
    await transporter.sendMail({
      from: `"作品集访客" <${process.env.SMTP_USER}>`,
      to: process.env.RECEIVE_EMAIL,
      subject: '作品集网站收到新留言',
      text: `访客姓名：${name}\n访客邮箱：${email}\n留言内容：${message}`
    });
    return res.status(200).json({ok:true, msg:"提交成功"});
  } catch (err) {
    console.error(err);
    return res.status(500).json({ok:false, msg:"发送失败"});
  }
}
