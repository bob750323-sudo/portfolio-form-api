import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ok:false,msg:"只支持POST"}), {status:405});
  }
  try{
    const body = await req.json();
    const {name,email,message} = body;
    await resend.emails.send({
      from: 'Form <onboarding@resend.dev>',
      to: process.env.RECEIVE_EMAIL,
      subject: `新表单提交 - ${name}`,
      html: `<p>姓名：${name}</p><p>邮箱：${email}</p><p>留言：${message}</p>`
    })
    return new Response(JSON.stringify({ok:true}), {
      status:200,
      headers:{"Content-Type":"application/json"}
    })
  }catch(e){
    return new Response(JSON.stringify({ok:false,err:e.message}), {status:500})
  }
}

export const config = {
  runtime: 'edge',
};
