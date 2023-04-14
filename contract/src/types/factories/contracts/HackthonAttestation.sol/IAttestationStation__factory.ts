/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  IAttestationStation,
  IAttestationStationInterface,
} from "../../../contracts/HackthonAttestation.sol/IAttestationStation";

const _abi = [
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "about",
            type: "address",
          },
          {
            internalType: "bytes32",
            name: "key",
            type: "bytes32",
          },
          {
            internalType: "bytes",
            name: "val",
            type: "bytes",
          },
        ],
        internalType: "struct AttestationStation.AttestationData[]",
        name: "_attestations",
        type: "tuple[]",
      },
    ],
    name: "attest",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export class IAttestationStation__factory {
  static readonly abi = _abi;
  static createInterface(): IAttestationStationInterface {
    return new utils.Interface(_abi) as IAttestationStationInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IAttestationStation {
    return new Contract(address, _abi, signerOrProvider) as IAttestationStation;
  }
}
