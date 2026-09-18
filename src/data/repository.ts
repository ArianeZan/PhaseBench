import { createMockBenchmarkRepository } from "./mock-benchmark-repository";
import { createRepositoryAccessor } from "./repository-accessor";

export const getBenchmarkRepository = createRepositoryAccessor(
  createMockBenchmarkRepository,
);
