import { inject, injectable } from 'inversify';

import { TYPES } from '@/types/identifiers';
import {
  AssignCaseRequestDto,
  CreateCaseRequestDto,
  DeleteCaseRequestDto,
} from '@/modules/cases/schemas/case.request.schema';
import {
  CaseListResponseDto,
  CaseResponseDto,
} from '@/modules/cases/schemas/case.response.schema';
import { handleRequest } from '@/common/http/handler';
import { CaseService } from '@/modules/cases/case.service';

@injectable()
export class CaseController {
  constructor(
    @inject(TYPES.CaseService)
    private readonly caseService: CaseService,
  ) {}

  createCase = handleRequest<CreateCaseRequestDto>(async (req) => {
    await this.caseService.create(req.body);
    return { status: 201 };
  });

  assignCase = handleRequest<AssignCaseRequestDto, CaseResponseDto>(
    async (req) => {
      const result = await this.caseService.assign(
        req.params.id,
        req.body.userId,
      );

      return {
        ...result,
        createdAt: result.createdAt.toISOString(),
        updatedAt: result.updatedAt.toISOString(),
      };
    },
  );

  listCases = handleRequest<unknown, CaseListResponseDto>(async () => {
    const cases = await this.caseService.list();
    return cases.map(
      (c): CaseResponseDto => ({
        id: c.id,
        title: c.title,
        status: 'OPEN',
        description: c.description,
        createdAt: c.createdAt.toISOString(),
        updatedAt: c.updatedAt.toISOString(),
        assignedUser: c.assignedUser,
      }),
    );
  });

  deleteCase = handleRequest<DeleteCaseRequestDto, { message: string }>(
    async (req) => {
      await this.caseService.delete(req.params.id);

      return { message: `Case with id ${req.params.id} deleted successfully.` };
    },
  );
}
