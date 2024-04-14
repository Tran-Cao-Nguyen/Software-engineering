using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace MyCompanyName.AbpZeroTemplate.Documents.Dto
{
    public class DocumentListDto
    {
        public int Id { get; set; }
        public string Title { get; set; }

        public string Code { get; set; }

        public DateTime ReleaseDate { get; set; }

        public string Organization { get; set; }

        public DateTime EffectiveDate { get; set; }

        public DateTime ExpirationDate { get; set; }

        public string Type { get; set; }

        public virtual string FileName { get; set; }

        public virtual string Citation { get; set; }
    }
}
