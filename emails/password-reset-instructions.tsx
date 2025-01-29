import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components'

interface PasswordResetInstructionsProps {
  name: string
  resetUrl: string
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL
  ? `https://${process.env.NEXT_PUBLIC_APP_URL}`
  : ''

export const PasswordResetInstructions = ({
  name,
  resetUrl,
}: PasswordResetInstructionsProps) => {
  const previewText = `Password reset instructions for ${name}`

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white font-sans">
          <Container className="mx-auto my-[40px] max-w-[465px] rounded-md border border-solid border-[#eaeaea]">
            <Section className="flex flex-col items-start bg-blue-50/40 p-6">
              <Img alt="" src={`${baseUrl}/static/logo.png`} width={150} />
              <Section className="mt-6 flex flex-col items-start space-y-1">
                <Text className="mt-0 text-4xl font-medium tracking-tight text-blue-500">
                  Forgot your Password?🫤
                </Text>
              </Section>
            </Section>
            <Section className="flex items-start px-6 pb-6">
              <Heading className="mx-0 p-0 text-2xl font-medium tracking-tight text-gray-900">
                Hello {name},
              </Heading>
              <Text className="text-base leading-[24px] text-gray-500">
                We noticed that you requested a password change. Click the link
                below to proceed with the update.
              </Text>
              <Section className="mb-[32px] mt-[24px] text-left">
                <Button
                  className="rounded bg-blue-500 px-5 py-3 text-center text-[12px] font-semibold text-white no-underline"
                  href={resetUrl}
                >
                  Redefinir senha
                </Button>
              </Section>
              <Text className="text-base leading-[24px] text-gray-500">
                Or copy and paste this URL in your browser: <br />
                <Link href={resetUrl} className="text-blue-600 no-underline">
                  {resetUrl}
                </Link>
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

PasswordResetInstructions.PreviewProps = {
  name: 'John Doe',
  resetUrl: 'https://example.com/reset-password',
} as PasswordResetInstructionsProps

export default PasswordResetInstructions
