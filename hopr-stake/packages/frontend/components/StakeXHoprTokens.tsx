import {
  Button,
  InputGroup,
  Input,
  InputRightElement,
  Text,
  Box,
} from '@chakra-ui/react'
import { XHoprBalance } from '../components/XHoprBalance'
import { HoprStakeBalance } from '../components/HoprStakeBalance'
import { initialState, reducer, setStaking } from '../lib/reducers'
import { RPC_COLOURS } from '../lib/connectors'
import { useEthers } from '@usedapp/core'
import { useReducer } from 'react'

export const StakeXHoprTokens = ({
  XHOPRContractAddress,
  HoprStakeContractAddress,
}: {
  XHOPRContractAddress: string
  HoprStakeContractAddress: string
}): JSX.Element => {
  const { chainId, library } = useEthers()
  const [state, dispatch] = useReducer(reducer, initialState)
  const colours = RPC_COLOURS[chainId]

  return (
    <>
      <Box d="flex" justifyContent="space-between" alignItems="center">
        <Text fontSize="xl" fontWeight="900">
          Stake xHOPR tokens
        </Text>
        <Text fontSize="xl" fontFamily="mono">
          Available:{' '}
          <XHoprBalance xHOPRContractAddress={XHOPRContractAddress} />
        </Text>
        <Text fontSize="xl" fontFamily="mono">
          Staked:{' '}
          <HoprStakeBalance
            HoprStakeContractAddress={HoprStakeContractAddress}
          />
        </Text>
      </Box>
      <Box
        d="flex"
        justifyContent="space-between"
        alignItems="center"
        mt="10px"
      >
        <InputGroup size="md">
          <Input
            pr="10.5rem"
            type={'number'}
            placeholder="Enter amount"
            onChange={(e) => {
              dispatch({
                type: 'SET_STAKING_AMOUNT',
                amountValue: e.target.value,
              })
            }}
          />
          <InputRightElement width="10.5rem">
            <Button
              width="10rem"
              size="sm"
              isLoading={state.isLoading}
              onClick={() => {
                setStaking(
                  XHOPRContractAddress,
                  HoprStakeContractAddress,
                  state,
                  library,
                  dispatch
                )
              }}
              {...colours}
            >
              {state.isLoading ? 'Loading...' : 'Stake xHOPR tokens'}
            </Button>
          </InputRightElement>
        </InputGroup>
      </Box>
    </>
  )
}