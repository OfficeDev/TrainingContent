//
//  Copyright (c) 2014 MS-OpenTech All rights reserved.
//

#import <UIKit/UIKit.h>

@interface CreateViewController : UIViewController

- (IBAction)createProject:(id)sender;

@property (weak, nonatomic) IBOutlet UITextField *FileNameTxt;
@property NSString* token;

@end
