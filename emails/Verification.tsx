import { Button, Font, Head, Heading, Html, Preview, Row, Section, Text } from '@react-email/components'

interface VerificationMailProps {
    username: string
    otp: string
}

const Verification = ({ username, otp }: VerificationMailProps) => {
    return (
        <Html lang='en' dir='ltr'>
            <Head>
                <title>
                    Verification Code
                </title>
                <Font
                    fontFamily='Roboto'
                    fallbackFontFamily='Verdana'
                    fontWeight={400}
                    fontStyle='normal'
                    webFont={{
                        url: 'https://fonts.gstatic.com/s/roboto/v27/KF0mCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
                        format: 'woff2'
                    }} />
            </Head>
            <Preview>
                Here&apos;s your Verification Code: {otp}
            </Preview>
            <Section>
                <Row>
                    <Heading as='h2'>
                        Hello {username},
                    </Heading>
                </Row>
                <Row>
                    <Text>
                        Thank you for Registering. Please use the Verification Code to complete your Registration
                    </Text>
                </Row>
                <Row>
                    <Text>
                        {otp}
                    </Text>
                </Row>
                <Row>
                    <Text>
                        If you did not request this code, Please ignore this mail. Thank You.
                    </Text>
                </Row>
                {/* <Row>
                    <Button href={`localhost:/verify/${username}`} color='#61dafb'>
                        Verify Here
                    </Button>
                </Row> */}
            </Section>
        </Html>
    )
}

export default Verification