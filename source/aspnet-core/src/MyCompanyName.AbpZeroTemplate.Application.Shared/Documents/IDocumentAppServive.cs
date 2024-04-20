using Abp.Application.Services;
using Abp.Application.Services.Dto;
using MyCompanyName.AbpZeroTemplate.Documents.Dto;
using MyCompanyName.AbpZeroTemplate.Dto;
using System.Threading.Tasks;


namespace MyCompanyName.AbpZeroTemplate.Documents
{
    public interface IDocumentAppServive : IApplicationService
    {
        ListResultDto<DocumentListDto> GetDocuments(GetDocumentsInput input);
        Task CreateDocuments(DocumentListDto input);

    }

}
