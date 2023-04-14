/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "../../common";

export declare namespace AttestationStation {
  export type AttestationDataStruct = {
    about: PromiseOrValue<string>;
    key: PromiseOrValue<BytesLike>;
    val: PromiseOrValue<BytesLike>;
  };

  export type AttestationDataStructOutput = [string, string, string] & {
    about: string;
    key: string;
    val: string;
  };
}

export interface IAttestationStationInterface extends utils.Interface {
  functions: {
    "attest((address,bytes32,bytes)[])": FunctionFragment;
  };

  getFunction(nameOrSignatureOrTopic: "attest"): FunctionFragment;

  encodeFunctionData(
    functionFragment: "attest",
    values: [AttestationStation.AttestationDataStruct[]]
  ): string;

  decodeFunctionResult(functionFragment: "attest", data: BytesLike): Result;

  events: {};
}

export interface IAttestationStation extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: IAttestationStationInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    attest(
      _attestations: AttestationStation.AttestationDataStruct[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  attest(
    _attestations: AttestationStation.AttestationDataStruct[],
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    attest(
      _attestations: AttestationStation.AttestationDataStruct[],
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {};

  estimateGas: {
    attest(
      _attestations: AttestationStation.AttestationDataStruct[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    attest(
      _attestations: AttestationStation.AttestationDataStruct[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}