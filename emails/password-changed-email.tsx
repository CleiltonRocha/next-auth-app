import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components'

interface PasswordChangedEmailProps {
  name: string
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL
  ? `https://${process.env.NEXT_PUBLIC_APP_URL}`
  : ''

export const PasswordChangedEmail = ({ name }: PasswordChangedEmailProps) => {
  const previewText = 'Password change notice'

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white font-sans">
          <Container className="mx-auto my-[40px] max-w-[465px] rounded-md border border-solid border-[#eaeaea]">
            <Section className="flex flex-col items-start bg-blue-50/40 p-6">
              <Img alt="" src={`${baseUrl}/static/logo.png`} width={150} />
              <Text className="mb-0 text-3xl font-medium tracking-tight text-gray-900">
                Password Change Notice🔒
              </Text>
            </Section>
            <Section className="flex items-start px-6 pb-6">
              <Heading className="mx-0 p-0 text-2xl font-medium tracking-tight text-gray-900">
                Hello, {name}!
              </Heading>
              <Text className="text-base leading-[24px] text-gray-500">
                Just a quick note: your password has been successfully changed!
                If you did this, you&apos;re all set. If not, please check it
                out as soon as possible. We&apos;re here to help, so if you need
                anything, just reach out. Thanks!
              </Text>
              <Section className="mb-[32px] mt-[24px] text-left">
                <Button
                  className="rounded bg-blue-500 px-5 py-3 text-center text-[12px] font-semibold text-white no-underline"
                  href={baseUrl}
                >
                  Log in to MyAPP
                </Button>
              </Section>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

PasswordChangedEmail.PreviewProps = {
  name: 'John Doe',
} as PasswordChangedEmailProps

export default PasswordChangedEmail
