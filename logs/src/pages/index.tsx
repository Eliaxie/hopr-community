import {
  Link as ChakraLink,
  Text,
  FormErrorMessage,
  FormControl,
  FormLabel,
  Button,
  Input
} from '@chakra-ui/react'
import { LinkIcon } from '@chakra-ui/icons'
import Head from 'next/head'

import { Hero } from '../components/Hero'
import { Container } from '../components/Container'
import { DarkModeSwitch } from '../components/DarkModeSwitch'
import { LogsTable } from '../components/LogsTable'
import { Formik, Field, Form } from "formik";
import CeramicClient from '@ceramicnetwork/http-client'
import { TileDocument } from '@ceramicnetwork/stream-tile'
import { useEffect, useState } from 'react'

const Index = () => {
  const ceramic = new CeramicClient('https://ceramic-clay.3boxlabs.com');
  const [log, setLog] = useState(undefined)
  const [stream, setStream] = useState(undefined)

  useEffect(() => {
    const loadLog = async() => {
      const publicLogs = log && await ceramic.loadStream(log)
      if (publicLogs && publicLogs.state.content) {
        setStream(publicLogs.state.content)
      }
    }
    loadLog();
  }, [log])

  
  
  function validateName(value: string) {
    let error
    if (!value) {
      error = "A unique log id is required"
    } else {
      try {
        console.log('Retrieve value here.')
      } catch (err) {
        error = "A valid ethereum address is required"
      }
    }
    return error
  }

  

  return (
    <Container height="100vh">
      <Head>
        <title>HOPR Node Logger</title>
        <link rel="icon" href="favicon.ico" />
      </Head>

      <Hero>
        <Text>
          Pass the flag <code>--publicLogs</code> to your <ChakraLink
            isExternal
            href="https://hoprnet.org"
            flexGrow={1}
            mr={2}
          >
            HOPR <LinkIcon />
          </ChakraLink>
          node and paste your unique Log Id here to monitor your node.
        </Text>
        <br />
        <Formik
          initialValues={{ name: "" }}
          onSubmit={(values, actions) => {
            setTimeout(async () => {
              const log = values.name;
              setLog(log);
              actions.setSubmitting(false)
            }, 0)
          }}
        >
          {(props) => (
            <Form style={{ width: '80%' }}>
              <Field name="name" validate={validateName}>
                {({ field, form }: { field: any, form: any }) => (
                  <FormControl isInvalid={form.errors.name && form.touched.name}>
                    <FormLabel htmlFor="name">HOPR Log Id</FormLabel>
                    <Input {...field} id="name" placeholder="kjzl6cwe1j..." />
                    <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Button
                mt={4}
                colorScheme="teal"
                isLoading={props.isSubmitting}
                type="submit"
              >
                Load logs
          </Button>
            </Form>
          )}
        </Formik>
        {
          stream && <LogsTable logs={stream}/>
        }
      </Hero>
      <DarkModeSwitch />
    </Container>
  )
}

export default Index