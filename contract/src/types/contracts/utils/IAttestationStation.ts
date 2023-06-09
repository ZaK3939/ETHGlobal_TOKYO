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
} from "../../common";

export declare namespace IAttestationStation {
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
    "attestations(address,address,bytes32)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic: "attest" | "attestations"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "attest",
    values: [IAttestationStation.AttestationDataStruct[]]
  ): string;
  encodeFunctionData(
    functionFragment: "attestations",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<BytesLike>
    ]
  ): string;

  decodeFunctionResult(functionFragment: "attest", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "attestations",
    data: BytesLike
  ): Result;

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
      _attestations: IAttestationStation.AttestationDataStruct[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    attestations(
      arg0: PromiseOrValue<string>,
      arg1: PromiseOrValue<string>,
      arg2: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<[string]>;
  };

  attest(
    _attestations: IAttestationStation.AttestationDataStruct[],
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  attestations(
    arg0: PromiseOrValue<string>,
    arg1: PromiseOrValue<string>,
    arg2: PromiseOrValue<BytesLike>,
    overrides?: CallOverrides
  ): Promise<string>;

  callStatic: {
    attest(
      _attestations: IAttestationStation.AttestationDataStruct[],
      overrides?: CallOverrides
    ): Promise<void>;

    attestations(
      arg0: PromiseOrValue<string>,
      arg1: PromiseOrValue<string>,
      arg2: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<string>;
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
    attest(
      _attestations: IAttestationStation.AttestationDataStruct[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    attestations(
      arg0: PromiseOrValue<string>,
      arg1: PromiseOrValue<string>,
      arg2: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    attest(
      _attestations: IAttestationStation.AttestationDataStruct[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    attestations(
      arg0: PromiseOrValue<string>,
      arg1: PromiseOrValue<string>,
      arg2: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
