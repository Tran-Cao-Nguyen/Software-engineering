﻿using System;
using System.Collections.Generic;
using System.Text;

namespace MyCompanyName.AbpZeroTemplate.Documents.Dto
{
    public class GetDocumentsInput
    {
        public string Filter { get; set; }
    }
    // Download
    public class GetDocumentDownload
    {
        public int Id { get; set; }
    }
}
