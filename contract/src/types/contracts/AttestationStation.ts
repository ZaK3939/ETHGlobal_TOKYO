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
import type {
  FunctionFragment,
  Result,
  EventFragment,
} from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "../common";

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

export interface AttestationStationInterface extends utils.Interface {
  functions: {
    "attest((address,bytes32,bytes)[])": FunctionFragment;
    "attest(address,bytes32,bytes)": FunctionFragment;
    "attestations(address,address,bytes32)": FunctionFragment;
    "version()": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "attest((address,bytes32,bytes)[])"
      | "attest(address,bytes32,bytes)"
      | "attestations"
      | "version"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "attest((address,bytes32,bytes)[])",
    values: [AttestationStation.AttestationDataStruct[]]
  ): string;
  encodeFunctionData(
    functionFragment: "attest(address,bytes32,bytes)",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<BytesLike>,
      PromiseOrValue<BytesLike>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "attestations",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<BytesLike>
    ]
  ): string;
  encodeFunctionData(functionFragment: "version", values?: undefined): string;

  decodeFunctionResult(
    functionFragment: "attest((address,bytes32,bytes)[])",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "attest(address,bytes32,bytes)",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "attestations",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "version", data: BytesLike): Result;

  events: {
    "AttestationCreated(address,address,bytes32,bytes)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "AttestationCreated"): EventFragment;
}

export interface AttestationCreatedEventObject {
  creator: string;
  about: string;
  key: string;
  val: string;
}
export type AttestationCreatedEvent = TypedEvent<
  [string, string, string, string],
  AttestationCreatedEventObject
>;

export type AttestationCreatedEventFilter =
  TypedEventFilter<AttestationCreatedEvent>;

export interface AttestationStation extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: AttestationStationInterface;

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
    "attest((address,bytes32,bytes)[])"(
      _attestations: AttestationStation.AttestationDataStruct[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    "attest(address,bytes32,bytes)"(
      _about: PromiseOrValue<string>,
      _key: PromiseOrValue<BytesLike>,
      _val: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    attestations(
      arg0: PromiseOrValue<string>,
      arg1: PromiseOrValue<string>,
      arg2: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<[string]>;

    version(overrides?: CallOverrides): Promise<[string]>;
  };

  "attest((address,bytes32,bytes)[])"(
    _attestations: AttestationStation.AttestationDataStruct[],
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  "attest(address,bytes32,bytes)"(
    _about: PromiseOrValue<string>,
    _key: PromiseOrValue<BytesLike>,
    _val: PromiseOrValue<BytesLike>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  attestations(
    arg0: PromiseOrValue<string>,
    arg1: PromiseOrValue<string>,
    arg2: PromiseOrValue<BytesLike>,
    overrides?: CallOverrides
  ): Promise<string>;

  version(overrides?: CallOverrides): Promise<string>;

  callStatic: {
    "attest((address,bytes32,bytes)[])"(
      _attestations: AttestationStation.AttestationDataStruct[],
      overrides?: CallOverrides
    ): Promise<void>;

    "attest(address,bytes32,bytes)"(
      _about: PromiseOrValue<string>,
      _key: PromiseOrValue<BytesLike>,
      _val: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<void>;

    attestations(
      arg0: PromiseOrValue<string>,
      arg1: PromiseOrValue<string>,
      arg2: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<string>;

    version(overrides?: CallOverrides): Promise<string>;
  };

  filters: {
    "AttestationCreated(address,address,bytes32,bytes)"(
      creator?: PromiseOrValue<string> | null,
      about?: PromiseOrValue<string> | null,
      key?: PromiseOrValue<BytesLike> | null,
      val?: null
    ): AttestationCreatedEventFilter;
    AttestationCreated(
      creator?: PromiseOrValue<string> | null,
      about?: PromiseOrValue<string> | null,
      key?: PromiseOrValue<BytesLike> | null,
      val?: null
    ): AttestationCreatedEventFilter;
  };

  estimateGas: {
    "attest((address,bytes32,bytes)[])"(
      _attestations: AttestationStation.AttestationDataStruct[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    "attest(address,bytes32,bytes)"(
      _about: PromiseOrValue<string>,
      _key: PromiseOrValue<BytesLike>,
      _val: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    attestations(
      arg0: PromiseOrValue<string>,
      arg1: PromiseOrValue<string>,
      arg2: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    version(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    "attest((address,bytes32,bytes)[])"(
      _attestations: AttestationStation.AttestationDataStruct[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    "attest(address,bytes32,bytes)"(
      _about: PromiseOrValue<string>,
      _key: PromiseOrValue<BytesLike>,
      _val: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    attestations(
      arg0: PromiseOrValue<string>,
      arg1: PromiseOrValue<string>,
      arg2: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    version(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}
