import { Case } from '@prisma/client';

export interface ICaseRepository {
  create(data: { title: string; description?: string }): Promise<Case>;

  findById(id: string): Promise<Case | null>;

  assign(caseId: string, userId: string): Promise<Case>;

  findAll(): Promise<Case[]>;

  delete(id: string): Promise<Case>;
}
