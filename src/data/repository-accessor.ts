import type { BenchmarkRepository } from "./benchmark-repository";

export type BenchmarkRepositoryFactory = () => BenchmarkRepository;
export type BenchmarkRepositoryAccessor = () => BenchmarkRepository;

export function createRepositoryAccessor(
  factory: BenchmarkRepositoryFactory,
): BenchmarkRepositoryAccessor {
  let repository: BenchmarkRepository | undefined;

  return () => {
    repository ??= factory();
    return repository;
  };
}
