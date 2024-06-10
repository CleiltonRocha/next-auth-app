import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface SendEmailProps {
  from: string
  to: string
  subject: string
  react: JSX.Element
}

export const sendEmail = async ({
  from,
  to,
  subject,
  react,
}: SendEmailProps) => {
  try {
    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      react,
    })

    if (error) {
      console.log(error)
    }

    return data
  } catch (error) {
    throw new Error('Failed to send email: ' + error)
  }
}
