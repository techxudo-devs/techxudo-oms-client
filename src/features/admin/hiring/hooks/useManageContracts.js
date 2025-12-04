import {
  useCreateContractMutation,
  useListContractsQuery,
  useGetContractByIdQuery,
} from "../api/hiringApiSlice";
import { useState } from "react";

export const useManageContracts = () => {
  const [createContract, { isLoading: isCreating }] =
    useCreateContractMutation();
};
