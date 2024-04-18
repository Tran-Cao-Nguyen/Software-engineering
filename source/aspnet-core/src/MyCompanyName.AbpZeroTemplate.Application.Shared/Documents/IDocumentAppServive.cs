using Abp.Application.Services;
using Abp.Application.Services.Dto;
using MyCompanyName.AbpZeroTemplate.Documents.Dto;
<<<<<<< HEAD
using MyCompanyName.AbpZeroTemplate.Dto;
=======
using System.Threading.Tasks;
>>>>>>> origin

namespace MyCompanyName.AbpZeroTemplate.Documents
{
    public interface IDocumentAppServive : IApplicationService
    {
        ListResultDto<DocumentListDto> GetDocuments(GetDocumentsInput input);
<<<<<<< HEAD

        // Download
        FileDto GetDocumentDownload(GetDocumentDownload input);
=======
        Task CreateDocuments(DocumentListDto input);
>>>>>>> origin
    }

}
