import { Transfer as TransferEvent } from "../generated/TestERC20Token/TestERC20Token"
import { AddressStatistic, Transfer } from "../generated/schema"

export function handleTransfer(event: TransferEvent): void {
  let entity = new Transfer(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  
  entity.from = event.params.from
  entity.to = event.params.to
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  let addressStatistic = AddressStatistic.load(entity.to);
  if (addressStatistic == null) {
    addressStatistic = new AddressStatistic(event.params.to);
    addressStatistic.address = event.params.to
    addressStatistic.totalAmount = event.params.amount
  }
  addressStatistic.totalAmount = addressStatistic.totalAmount.plus(entity.amount)
  
  addressStatistic.save()
  entity.save()
}
