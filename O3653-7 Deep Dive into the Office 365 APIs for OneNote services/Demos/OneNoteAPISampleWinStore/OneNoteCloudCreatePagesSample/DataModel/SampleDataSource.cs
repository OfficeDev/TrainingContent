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

using System;
using System.Linq;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Threading.Tasks;
using Windows.UI.Xaml.Media;
using Windows.UI.Xaml.Media.Imaging;
using System.Collections.Specialized;

// The data model defined by this file serves as a representative example of a strongly-typed
// model that supports notification when members are added, removed, or modified.  The property
// names chosen coincide with data bindings in the standard item templates.
//
// Applications may use this model as a starting point and build on it, or discard it entirely and
// replace it with something appropriate to their needs.

namespace OneNoteCloudCreatePagesSample.DataModel
{
    /// <summary>
    /// Base class for <see cref="SampleDataItem"/> and <see cref="SampleDataGroup"/> that
    /// defines properties common to both.
    /// </summary>
    [Windows.Foundation.Metadata.WebHostHidden]
    public abstract class SampleDataCommon : Common.BindableBase
    {
        private static readonly Uri BaseUri = new Uri("ms-appx:///");

        protected SampleDataCommon(String uniqueId, String title, String imagePath, String description)
        {
            this._uniqueId = uniqueId;
            this._title = title;

            this._description = description;
            this._imagePath = imagePath;
        }

        private string _uniqueId = string.Empty;

        public string UniqueId
        {
            get { return this._uniqueId; }
            set { this.SetProperty(ref this._uniqueId, value); }
        }

        private string _title = string.Empty;

        public string Title
        {
            get { return this._title; }
            set { this.SetProperty(ref this._title, value); }
        }

        private string _description = string.Empty;

        public string Description
        {
            get { return this._description; }
            set { this.SetProperty(ref this._description, value); }
        }

        private ImageSource _image;
        private String _imagePath;

        public ImageSource Image
        {
            get
            {
                if (this._image == null && this._imagePath != null)
                {
                    this._image = new BitmapImage(new Uri(SampleDataCommon.BaseUri, this._imagePath));
                }
                return this._image;
            }

            set
            {
                this._imagePath = null;
                this.SetProperty(ref this._image, value);
            }
        }

        public void SetImage(String path)
        {
            this._image = null;
            this._imagePath = path;
// ReSharper disable ExplicitCallerInfoArgument
            this.OnPropertyChanged("Image");
// ReSharper restore ExplicitCallerInfoArgument
        }

        public override string ToString()
        {
            return this.Title;
        }
    }

    /// <summary>
    /// Generic item data model.
    /// </summary>
    public class SampleDataItem : SampleDataCommon
    {
        public SampleDataItem(String uniqueId, String title, String imagePath, String description,
                              Func<bool, string, Task<StandardResponse>> action, 
                              SampleDataGroup group)
            : base(uniqueId, title, imagePath, description)
        {
            this._action = action;
            this._group = group;
        }

        private Func<bool, string, Task<StandardResponse>> _action;

        public Func<bool, string, Task<StandardResponse>> Action
        {
            get { return this._action; }
            set { this.SetProperty(ref this._action, value); }
        }

        private SampleDataGroup _group;

        public SampleDataGroup Group
        {
            get { return this._group; }
            set { this.SetProperty(ref this._group, value); }
        }
    }

    /// <summary>
    /// Generic group data model.
    /// </summary>
    public class SampleDataGroup : SampleDataCommon
    {
        public SampleDataGroup(String uniqueId, String title, String imagePath, String description)
            : base(uniqueId, title, imagePath, description)
        {
            Items.CollectionChanged += ItemsCollectionChanged;
        }

        private readonly CreateExamples _facade = new CreateExamples(MainPage.Current.AuthClient);

        public CreateExamples Facade
        {
            get { return this._facade; }
        }

        private void ItemsCollectionChanged(object sender, NotifyCollectionChangedEventArgs e)
        {
            // Provides a subset of the full items collection to bind to from a GroupedItemsPage
            // for two reasons: GridView will not virtualize large items collections, and it
            // improves the user experience when browsing through groups with large numbers of
            // items.
            //
            // A maximum of 12 items are displayed because it results in filled grid columns
            // whether there are 1, 2, 3, 4, or 6 rows displayed

            switch (e.Action)
            {
                case NotifyCollectionChangedAction.Add:
                    if (e.NewStartingIndex < 12)
                    {
                        TopItems.Insert(e.NewStartingIndex, Items[e.NewStartingIndex]);
                        if (TopItems.Count > 12)
                        {
                            TopItems.RemoveAt(12);
                        }
                    }
                    break;
                case NotifyCollectionChangedAction.Move:
                    if (e.OldStartingIndex < 12 && e.NewStartingIndex < 12)
                    {
                        TopItems.Move(e.OldStartingIndex, e.NewStartingIndex);
                    }
                    else if (e.OldStartingIndex < 12)
                    {
                        TopItems.RemoveAt(e.OldStartingIndex);
                        TopItems.Add(Items[11]);
                    }
                    else if (e.NewStartingIndex < 12)
                    {
                        TopItems.Insert(e.NewStartingIndex, Items[e.NewStartingIndex]);
                        TopItems.RemoveAt(12);
                    }
                    break;
                case NotifyCollectionChangedAction.Remove:
                    if (e.OldStartingIndex < 12)
                    {
                        TopItems.RemoveAt(e.OldStartingIndex);
                        if (Items.Count >= 12)
                        {
                            TopItems.Add(Items[11]);
                        }
                    }
                    break;
                case NotifyCollectionChangedAction.Replace:
                    if (e.OldStartingIndex < 12)
                    {
                        TopItems[e.OldStartingIndex] = Items[e.OldStartingIndex];
                    }
                    break;
                case NotifyCollectionChangedAction.Reset:
                    TopItems.Clear();
                    while (TopItems.Count < Items.Count && TopItems.Count < 12)
                    {
                        TopItems.Add(Items[TopItems.Count]);
                    }
                    break;
            }
        }

        private readonly ObservableCollection<SampleDataItem> _items = new ObservableCollection<SampleDataItem>();

        public ObservableCollection<SampleDataItem> Items
        {
            get { return this._items; }
        }

        private readonly ObservableCollection<SampleDataItem> _topItem = new ObservableCollection<SampleDataItem>();

        public ObservableCollection<SampleDataItem> TopItems
        {
            get { return this._topItem; }
        }
    }

    /// <summary>
    /// Creates a collection of groups and items with hard-coded content.
    /// 
    /// SampleDataSource initializes with placeholder data rather than live production
    /// data so that sample data is provided at both design-time and run-time.
    /// </summary>
    public sealed class SampleDataSource
    {
        private static readonly SampleDataSource Instance;

        static SampleDataSource()
        {
            Instance = new SampleDataSource();
        }

        private readonly ObservableCollection<SampleDataGroup> _allGroups = new ObservableCollection<SampleDataGroup>();

        public ObservableCollection<SampleDataGroup> AllGroups
        {
            get { return this._allGroups; }
        }

        public static IEnumerable<SampleDataGroup> GetGroups(string uniqueId)
        {
            if (!uniqueId.Equals("AllGroups"))
                throw new ArgumentException("Only 'AllGroups' is supported as a collection of groups");

            return Instance.AllGroups;
        }

        public static SampleDataGroup GetGroup(string uniqueId)
        {
            // Simple linear search is acceptable for small data sets
            return Instance.AllGroups.FirstOrDefault(group => @group.UniqueId.Equals(uniqueId));
        }

        public static SampleDataItem GetItem(string uniqueId)
        {
            // Simple linear search is acceptable for small data sets
            return
                Instance.AllGroups.SelectMany(group => @group.Items)
                        .FirstOrDefault(item => item.UniqueId.Equals(uniqueId));
        }

        public SampleDataSource()
        {
            var createGroup = new SampleDataGroup("CreateScenarios",
                                                  "Create Pages",
                                                  "Assets/DarkGray.png",
                                                  "Examples of how to use the HTTP POST verb to create pages in OneNote.");
            createGroup.Items.Add(new SampleDataItem("CreateSimple",
                                                     "Create simple page using HTML",
                                                     "Assets/LightGray.png",
                                                     "Create a simple page using HTML to describe the page content.",
                                                     createGroup.Facade.CreateSimplePage,
                                                     createGroup));
            createGroup.Items.Add(new SampleDataItem("CreateWithImage",
                                                     "Create a page with an image",
                                                     "Assets/MediumGray.png",
                                                     "Create a page with some formatted text and an image",
                                                     createGroup.Facade.CreatePageWithImage,
                                                     createGroup));
            createGroup.Items.Add(new SampleDataItem("CreateWithEmbeddedSnapshot",
                                                     "Create a page with a snaphot of an embedded web page",
                                                     "Assets/DarkGray.png",
                                                     "Create a page with a snapshot of the HTML of a web page on it.",
                                                     createGroup.Facade.CreatePageWithEmbeddedWebPage,
                                                     createGroup));
            createGroup.Items.Add(new SampleDataItem("CreatwWithPublicSnapshot",
                                                     "Create a page with a snaphot of a public web page",
                                                     "Assets/DarkGray.png",
                                                     "Create a page with a snapshot of the OneNote.com homepage on it.",
                                                     createGroup.Facade.CreatePageWithUrl,
                                                     createGroup));
            createGroup.Items.Add(new SampleDataItem("CreateWithAttachmentAndPDFRendering",
                                                     "Create a page with a PDF attachment rendered",
                                                     "Assets/DarkGray.png",
                                                     "Create a page with a PDF file attachment rendered",
                                                     createGroup.Facade.CreatePageWithPDFAttachedAndRendered,
                                                     createGroup));
            this.AllGroups.Add(createGroup);
        }
    }
}
