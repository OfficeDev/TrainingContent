#import "ViewController.h"
#import "FileGraphService.h"
@interface FileDetailsViewController : ViewController<UIDocumentInteractionControllerDelegate>
@property (weak, nonatomic) IBOutlet UILabel *fileName;
@property (weak, nonatomic) IBOutlet UILabel *lastModified;
@property (weak, nonatomic) IBOutlet UILabel *created;
- (IBAction)downloadAction:(id)sender;

@property (nonatomic) UIActivityIndicatorView* spinner;
@property MSGraphServiceDriveItem *file;
@property (nonatomic, strong) UIDocumentInteractionController *docInteractionController;
@end
