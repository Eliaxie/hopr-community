import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
} from "@chakra-ui/react"

export const LogsTable = ({ logs }) => (
  <Table maxWidth="80%" height="500px" overflow="scroll" d="block" variant="simple">
    <TableCaption>Logs for your node.</TableCaption>
    <Thead>
      <Tr>
        <Th>Timestamp</Th>
        <Th>Message</Th>
        <Th>Type</Th>
      </Tr>
    </Thead>
    <Tbody>
      {
        Object.keys(logs).map(key => (
          <Tr>
            <Td>{logs[key].ts}</Td>
            <Td>{logs[key].msg}</Td>
            <Td>{logs[key].type}</Td>
          </Tr>
        ))
      }
    </Tbody>
  </Table>
)