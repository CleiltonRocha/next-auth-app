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

interface WelcomeEmailProps {
  name: string
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL
  ? `https://${process.env.NEXT_PUBLIC_APP_URL}`
  : ''

export const WelcomeEmail = ({ name }: WelcomeEmailProps) => {
  const previewText = `Bem-vindo(a) ${name}!`

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
                  Seja bem-vindo(a), {name}!
                </Text>
                <Text className="mt-0 text-4xl font-medium tracking-tight text-blue-500">
                  Estamos felizes em ter você com a gente! 🎉
                </Text>
              </Section>
            </Section>
            <Section className="flex items-start px-6 pb-6">
              <Heading className="mx-0 p-0 text-2xl font-medium tracking-tight text-gray-900">
                E aí, {name},
              </Heading>
              <Text className="text-base leading-[24px] text-gray-500">
                Estamos muito animados em te receber! Aproveite todas as
                funcionalidades e, se precisar de ajuda, estamos por aqui.
              </Text>
              <Section className="mb-[32px] mt-[24px] text-left">
                <Button
                  className="rounded bg-blue-500 px-5 py-3 text-center text-[12px] font-semibold text-white no-underline"
                  href={baseUrl}
                >
                  Comece agora
                </Button>
              </Section>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

WelcomeEmail.PreviewProps = {
  name: 'John Doe',
} as WelcomeEmailProps

export default WelcomeEmail
