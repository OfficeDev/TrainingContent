//*********************************************************
// Copyright (c) Microsoft Corporation
// All rights reserved. 
//
// Licensed under the Apache License, Version 2.0 (the ""License""); 
// you may not use this file except in compliance with the License. 
// You may obtain a copy of the License at 
// http://www.apache.org/licenses/LICENSE-2.0 
//
// THIS CODE IS PROVIDED ON AN  *AS IS* BASIS, WITHOUT 
// WARRANTIES OR CONDITIONS OF ANY KIND, EITHER EXPRESS 
// OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED 
// WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR 
// PURPOSE, MERCHANTABLITY OR NON-INFRINGEMENT. 
//
// See the Apache Version 2.0 License for specific language 
// governing permissions and limitations under the License.
//*********************************************************

using System.Net;

namespace OneNoteCloudCreatePagesSample
{
    /// <summary>
    /// Base class representing a simplified response from a service call 
    /// </summary>
    public abstract class StandardResponse
    {
        public HttpStatusCode StatusCode { get; set; }
        
        /// <summary>
        /// Per call identifier that can be logged to diagnose issues with Microsoft support
        /// </summary>
        public string CorrelationId { get; set; }
    }

    /// <summary>
    /// Class representing standard error from the service
    /// </summary>
    public class StandardErrorResponse : StandardResponse
    {
        /// <summary>
        /// Error message - intended for developer, not end user
        /// </summary>
        public string Message { get; set; }

        /// <summary>
        /// Constructor
        /// </summary>
        public StandardErrorResponse()
        {
            this.StatusCode = HttpStatusCode.InternalServerError;
        }
    }

    /// <summary>
    /// Class representing a successful create call from the service
    /// </summary>
    public class CreateSuccessResponse : StandardResponse
    {
        /// <summary>
        /// URL to launch OneNote rich client
        /// </summary>
        public string OneNoteClientUrl { get; set; }

        /// <summary>
        /// URL to launch OneNote web experience
        /// </summary>
        public string OneNoteWebUrl { get; set; }
    }
}