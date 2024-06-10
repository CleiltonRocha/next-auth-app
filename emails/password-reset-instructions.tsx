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
              <Img
                alt="Examify horizontal logo"
                src={`${baseUrl}/static/horizontal-dark-logo.svg `}
                width={150}
              />
              <Section className="mt-6 flex flex-col items-start space-y-1">
                <Text className="mb-0 text-3xl font-medium tracking-tight text-gray-900">
                  Ops! Quer dizer que você
                </Text>
                <Text className="mt-0 text-4xl font-medium tracking-tight text-blue-500">
                  esqueceu a senha?🫤
                </Text>
              </Section>
            </Section>
            <Section className="flex items-start px-6 pb-6">
              <Img
                alt="Examify horizontal logo"
                src={`${baseUrl}/static/lock-icon.svg `}
                width={32}
                className="mt-8"
              />
              <Heading className="mx-0 p-0 text-2xl font-medium tracking-tight text-gray-900">
                Opaa {name},
              </Heading>
              <Text className="text-base leading-[24px] text-gray-500">
                Vimos que você pediu pra trocar a senha. Dá um clique no link
                abaixo pra seguir com a mudança.
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
                Ou copie e cole esta URL no seu navegador: <br />
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
