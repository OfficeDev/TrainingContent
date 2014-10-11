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

namespace OneNoteCloudCreatePagesSample.Common
{
    using System;
    using System.Windows.Input;
    using Windows.UI.ApplicationSettings;
    using Windows.UI.Xaml;
    using Windows.UI.Xaml.Controls;
    using Windows.UI.Xaml.Markup;
    using Windows.UI.Xaml.Media.Animation;

    /// <summary>
    /// Base class for a settings flyout.  Note there is a built-in SettingsFlyout class in Windows 8.1
    /// </summary>
    [ContentProperty(Name = "Content")]
    public abstract class SettingsFlyout : ContentControl
    {
        public static readonly DependencyProperty IsOpenProperty =
            DependencyProperty.Register("IsOpen", typeof(bool), typeof(SettingsFlyout), new PropertyMetadata(null));
        public static readonly DependencyProperty HeaderTextProperty =
            DependencyProperty.Register("HeaderText", typeof(string), typeof(SettingsFlyout), new PropertyMetadata(null));
        public static readonly DependencyProperty BackCommandProperty =
            DependencyProperty.Register("BackCommand", typeof(ICommand), typeof(SettingsFlyout), new PropertyMetadata(null));
        public static readonly DependencyProperty MainContentTransitionsProperty =
            DependencyProperty.Register("MainContentTransitions", typeof(TransitionCollection), typeof(SettingsFlyout), new PropertyMetadata(null));

        private const int ContentAnimationOffset = 100; // UX guidelines
        private const int WideWidth = 646; // UX guidelines (wide is 646 and narrow is 346) 

        /// <summary>
        /// Initializes a new instance of the <see cref="SettingsFlyout" /> class.
        /// </summary>
        protected SettingsFlyout()
        {
            Width = WideWidth;
            DefaultStyleKey = typeof(SettingsFlyout);
            BackCommand = new Command(HandleBackCommand);
            MainContentTransitions = new TransitionCollection
            {
                new EntranceThemeTransition
                {
                    // The settings window may be invoked from the left side of the screen
                    // if the system's text direction is right-to-left
                    FromHorizontalOffset = SettingsPane.Edge == SettingsEdgeLocation.Right
                        ? ContentAnimationOffset
                        : -ContentAnimationOffset,
                },
            };

            SizeChanged += HandleSizeChanged;
            Position();
        }

        /// <summary>
        /// Gets the back command.
        /// </summary>
        /// <value>
        /// The back command.
        /// </value>
        public ICommand BackCommand
        {
            get { return (ICommand)GetValue(BackCommandProperty); }
            private set { SetValue(BackCommandProperty, value); }
        }

        /// <summary>
        /// Gets or sets a value that indicates whether the <see cref="SettingsFlyout" /> is visible.
        /// </summary>
        /// <value>
        ///   <c>true</c> if the <see cref="SettingsFlyout" /> is visible; otherwise, <c>false</c>. The default is <c>false</c>.
        /// </value>
        public bool IsOpen
        {
            get { return (bool)GetValue(IsOpenProperty); }
            set
            {
                // Light-dismissal leaves IsOpen = true, which means we can't reopen the popup; we need to reset IsOpen first
                SetValue(IsOpenProperty, false);
                SetValue(IsOpenProperty, value);
            }
        }

        /// <summary>
        /// Gets or sets the header text.
        /// </summary>
        /// <value>
        /// The header text.
        /// </value>
        public string HeaderText
        {
            get { return (string)GetValue(HeaderTextProperty); }
            set { SetValue(HeaderTextProperty, value); }
        }

        /// <summary>
        /// Gets or sets the collection of <see cref="Transition" /> style elements that apply to the main content of a <see cref="SettingsFlyout" />.
        /// </summary>
        /// <returns>The strongly typed collection of <see cref="Transition" /> style elements.</returns>
        /// <remarks>
        /// This property is different than the inherited <c>ContentTransitions</c>;
        /// since it only applies to the main content and not the header of the flyout.
        /// </remarks>
        public TransitionCollection MainContentTransitions
        {
            get { return (TransitionCollection)GetValue(MainContentTransitionsProperty); }
            set { SetValue(MainContentTransitionsProperty, value); }
        }

        /// <summary>
        /// Opens this <see cref="SettingsFlyout" />.
        /// </summary>
        internal void Open()
        {
            this.OnOpening();
            Position();
            IsOpen = true;
        }

        /// <summary>
        /// Override point for derived classes to add their logic before the pane is shown.
        /// </summary>
        protected virtual void OnOpening()
        {

        }

        /// <summary>
        /// Positions this <see cref="SettingsFlyout" />.
        /// </summary>
        private void Position()
        {
            // The settings window may be invoked from the left side of the screen
            // if the system's text direction is right-to-left
            double left = SettingsPane.Edge == SettingsEdgeLocation.Right
                ? Window.Current.Bounds.Width - WideWidth
                : 0;

            this.Margin = new Thickness(left, top: 0, right: 0, bottom: 0);
            this.Height = Window.Current.Bounds.Height;
        }

        /// <summary>
        /// Handles the <see cref="FrameworkElement.SizeChanged" /> event of the <see cref="SettingsFlyout" /> control.
        /// </summary>
        /// <param name="sender">The source of the event.</param>
        /// <param name="e">The <see cref="SizeChangedEventArgs" /> instance containing the event data.</param>
        private void HandleSizeChanged(object sender, SizeChangedEventArgs e)
        {
            Height = e.NewSize.Height;
        }

        /// <summary>
        /// Handles the back command.
        /// </summary>
        private void HandleBackCommand()
        {
            IsOpen = false;
            SettingsPane.Show();
        }

        /// <summary>
        /// Represents a settings flyout command.
        /// </summary>
        private class Command : ICommand
        {
            /// <summary>
            /// Occurs when changes occur that affect whether the command should execute.
            /// </summary>
            public event EventHandler CanExecuteChanged;

            protected virtual void OnCanExecuteChanged()
            {
                EventHandler handler = CanExecuteChanged;
                if (handler != null) handler(this, EventArgs.Empty);
            }

            private readonly Action _action;

            /// <summary>
            /// Initializes a new instance of the <see cref="Command" /> class.
            /// </summary>
            /// <param name="action">The action to execute when the command is issued.</param>
            public Command(Action action)
            {
                _action = action;
            }

            /// <summary>
            /// Defines the method that determines whether the command can execute in its current state.
            /// </summary>
            /// <param name="parameter">Data used by the command. If the command does not require data to be passed, this object can be set to null.</param>
            /// <returns>
            /// <c>true</c> if this command can be executed; otherwise, <c>false</c>.
            /// </returns>
            /// <exception cref="System.NotImplementedException"></exception>
            public bool CanExecute(object parameter)
            {
                return true;
            }

            /// <summary>
            /// Defines the method to be called when the command is invoked.
            /// </summary>
            /// <param name="parameter">Data used by the command.  If the command does not require data to be passed, this object can be set to null.</param>
            /// <exception cref="System.NotImplementedException"></exception>
            public void Execute(object parameter)
            {
                _action();
            }
        }
    }
}
